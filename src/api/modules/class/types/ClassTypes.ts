import { z } from "zod";
import { createClassSchema } from "../validators/ClassCreateSchema";

export type CreateClassData = z.infer<typeof createClassSchema>;

export interface ClassCriteria {
  id?: number;
  name?: string;
  tenantId?: number;
}

export interface UpdateClassData {
    name?: string;
    tenantId?: number;
  }

export interface GetAndUpdateClass {
    criteria: ClassCriteria;
    data: UpdateClassData;
    updateStatus?: boolean;
}
