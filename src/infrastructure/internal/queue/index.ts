import { Queue, Worker, Job, QueueEvents } from "bullmq";
import AppSettings from "~/api/shared/setttings/AppSettings";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

export type JobData = {
  [key: string]: any;
};

export type JobResult = {
  status: "completed" | "failed";
  data?: any;
  error?: string;
};

class QueueProvider {
  private static instances: Map<string, Queue> = new Map();
  private static workers: Map<string, Worker> = new Map();
  private static loggingProvider: ILoggingDriver = LoggingProviderFactory.build();

  private constructor() {}

  private static getConnectionConfig() {
    const redisUrl = new URL(AppSettings.getCacheUrl());
    const config = {
      host: redisUrl.hostname,
      port: parseInt(redisUrl.port),
      password: redisUrl.password,
      tls: redisUrl.protocol === "rediss:" ? {} : undefined,
      enableReadyCheck: true,
      connectTimeout: 60000,
      keepAlive: 30000,
      retryStrategy: (times: number) => Math.min(times * 500, 5000),
    };

    return config;
  }

  public static getQueue(queueName: string): Queue {
    try {
      if (!this.instances.has(queueName)) {
        const queue = new Queue(queueName, {
          connection: this.getConnectionConfig(),
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: 1000,
            },
          },
        });

        // Set up queue events
        const queueEvents = new QueueEvents(queueName, {
          connection: this.getConnectionConfig(),
        });

        // 4th if completed
        queueEvents.on("completed", ({ jobId }) => {
          this.loggingProvider.info(`JOBID - ${jobId} has completed on QUEUENAME - ${queueName}`);
        });

        queueEvents.on("failed", ({ jobId, failedReason }) => {
          this.loggingProvider.error(`JOBID - ${jobId} has failed on QUEUENAME - ${queueName}: ${failedReason}`);
        });

        queue.on("waiting", (job) => {
          this.loggingProvider.info(`JOBID - ${job.id} is waiting in QUEUENAME - ${queueName}`);
        });

        queue.on("error", (error) => {
          this.loggingProvider.error(`QUEUE - ${queueName} error: ${error}`);
        });

        this.instances.set(queueName, queue);
      }

      return this.instances.get(queueName)!;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(error);
    }
  }

  public static async addJob<T extends JobData>(queueName: string, jobName: string, data: T, opts?: { priority?: number; delay?: number; attempts?: number }): Promise<Job<T, JobResult>> {
    try {
      const queue = this.getQueue(queueName);

      const job = await queue.add(jobName, data, {
        priority: opts?.priority,
        delay: opts?.delay,
        attempts: opts?.attempts || 3,
        removeOnComplete: true,
        removeOnFail: 1000,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      });

      this.loggingProvider.info(`Job added successfully. JOBID - ${job.id}, QUEUENAME - ${queueName}`);
      return job;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(error);
    }
  }

  public static registerWorker(queueName: string, processor: (job: Job) => Promise<JobResult>): Worker {
    try {
      if (!this.workers.has(queueName)) {
        const worker = new Worker(
          queueName,
          async (job: Job): Promise<JobResult> => {
            try {
              return await processor(job);
            } catch (error: any) {
              this.loggingProvider.error(`Error processing JOBID - ${job.id} on QUEUENAME - ${queueName}: ${error}`);
              throw new InternalServerError(error);
            }
          },
          {
            connection: this.getConnectionConfig(),
            autorun: true,
            maxStalledCount: 10,
            stalledInterval: 30000,
          }
        );

        worker.on("completed", (job) => {
          this.loggingProvider.info(`Worker completed JOBID - ${job.id} on QUEUENAME - ${queueName}`);
        });

        worker.on("failed", (job, error) => {
          this.loggingProvider.error(`Worker failed JOBID - ${job?.id} on QUEUENAME - ${queueName}: ${error}`);
        });

        worker.on("active", (job) => {
          this.loggingProvider.info(`Job ${job.id} has started processing on QUEUENAME - ${queueName}`);
        });

        worker.on("error", (error) => {
          this.loggingProvider.error(`Worker error on QUEUENAME - ${queueName}: ${error}`);
        });

        this.workers.set(queueName, worker);
      }

      return this.workers.get(queueName)!;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(error);
    }
  }

  public static async closeAll(): Promise<void> {
    try {
      for (const [name, queue] of this.instances) {
        await queue.close();
        this.loggingProvider.info(`Closed queue ${name}`);
      }

      for (const [name, worker] of this.workers) {
        await worker.close();
        this.loggingProvider.info(`Closed worker ${name}`);
      }
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(error);
    }
  }
}

export default QueueProvider;
