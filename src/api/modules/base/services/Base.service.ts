import { IResult } from "~/api/shared/helpers/results/IResult"
import { Result } from "~/api/shared/helpers/results/Result"

export abstract class BaseService<T> {
  result = new Result()

  abstract execute(args?: T): Promise<IResult>
}
