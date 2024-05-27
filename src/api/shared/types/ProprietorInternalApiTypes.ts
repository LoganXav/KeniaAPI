import { CreateProprietorRecordDTO } from "~/api/modules/auth/types/AuthDTO"

export type ProprietorRecordDTO = CreateProprietorRecordDTO & {
  tenantId: number
}
