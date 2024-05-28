import { SignUpUserRecordDTO } from "~/api/modules/auth/types/AuthDTO"

export type ProprietorRecordDTO = SignUpUserRecordDTO & {
  tenantId: number
}
