import { IResult } from "~/api/shared/helpers/results/IResult"
import { Result } from "~/api/shared/helpers/results/Result"
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"

export abstract class BaseService<T> {
  result = new Result()

  constructor(public readonly CONTEXT: string) {}

  abstract execute(trace: ServiceTrace, args?: T): Promise<IResult>

  initializeServiceTrace<I>(
    audit: ServiceTrace,
    input?: I,
    propsToRemove?: string[]
  ): void {
    audit.setContext(this.CONTEXT)
    audit.setArgs(input, propsToRemove)
  }
}
