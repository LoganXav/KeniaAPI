import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum"

export abstract class BaseService {
  applicationStatus = ApplicationStatusEnum
}
