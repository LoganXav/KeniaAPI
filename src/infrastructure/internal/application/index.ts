import { Server, createServer } from "http";
import Express from "~/infrastructure/internal/express";
import AppSettings from "~/api/shared/setttings/AppSettings";

export class Application {
  express: Express;
  server: Server;

  constructor() {
    this.express = new Express();
    this.server = createServer(this.express.app);
  }

  start(startAt: Date): void {
    this.express
      .initializeServices()
      .then(() => {
        this.server.listen(AppSettings.ServerPort);
      })
      .catch((error: Error) => {
        this.express.loggingProvider.error(`Starting server error: ${error}`);
      });

    this.server.on("listening", () => {
      this.express.apiDocGenerator.saveApiDoc().finish();
      this.express.loggingProvider.info(`${AppSettings.ServiceName.toUpperCase()} Server running on ${AppSettings.ServerHost}:${AppSettings.ServerPort}${AppSettings.ServerRoot}`);
      const seconds = ((new Date().valueOf() - startAt.valueOf()) / 1000).toFixed(3);
      console.log(`Started Application in ${process.uptime().toFixed(3)} seconds (${AppSettings.ServiceName.toUpperCase()} running for ${seconds})`);
    });
  }
}
