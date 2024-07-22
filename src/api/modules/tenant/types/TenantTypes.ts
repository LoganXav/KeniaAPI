// TODO: Add createTeneant record params
export type CreateTenantRecordType = null;

export interface TenantCriteria {
  id?: number;
  name?: string;
  address?: string;
}

export interface UpdateTenantData {
  name?: string;
  address?: string;
}

export interface GetAndUpdateTenant {
  criteria: TenantCriteria;
  data: UpdateTenantData;
  updateStatus?: boolean;
}
