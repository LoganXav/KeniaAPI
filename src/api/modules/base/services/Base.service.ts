import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum"
import { IResult } from "~/api/shared/helpers/results/IResult"

export abstract class BaseService<T> {
  applicationStatus = ApplicationStatusEnum

  abstract execute(args?: T): Promise<IResult>
}
