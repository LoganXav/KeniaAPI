import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { BaseService } from "../../base/services/Base.service"
import { VerifyUserTokenDTO } from "../types/AuthDTO"

export default class AuthVerifyOtpTokenService extends BaseService<VerifyUserTokenDTO> {
  public async execute(trace: ServiceTrace, args: VerifyUserTokenDTO) {
    // find the user with the token given

    // change his hasVerified to true

    //

    return this.result
  }
}
