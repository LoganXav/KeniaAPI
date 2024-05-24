import { IResult } from "~/api/shared/helpers/results/IResult"
import { Result } from "~/api/shared/helpers/results/Result"
import { IResponse } from "~/infrastructure/internal/types"

export abstract class BaseService<T> {
  result = new Result()

  abstract execute(args?: T, res?: IResponse): Promise<IResult>
}
