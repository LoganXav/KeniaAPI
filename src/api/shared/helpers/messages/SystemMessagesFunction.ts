export function RESOURCE_FETCHED_SUCCESSFULLY(resourceName = "Resource") {
  return `${resourceName} fetched successfully.`;
}

export function RESOURCE_RECORD_NOT_FOUND(resourceName = "Resource") {
  return `${resourceName} record was not found.`;
}

export function RESOURCE_RECORD_CREATED_SUCCESSFULLY(resourceName = "Resource") {
  return `${resourceName} record created successfully.`;
}

export function RESOURCE_RECORD_UPDATED_SUCCESSFULLY(resourceName = "Resource") {
  return `${resourceName} record updated successfully.`;
}

export function RESOURCE_RECORD_DELETED_SUCCESSFULLY(resourceName = "Resource") {
  return `${resourceName} record deleted successfully.`;
}

export function RESOURCE_RECORD_ALREADY_EXISTS(resourceName = "Resource") {
  return `${resourceName} record already exists.`;
}

export function RESOURCE_RECORD_NOT_FOUND_WITH_ID(resourceName = "Resource", id = "ID") {
  return `${resourceName} record with ${id} was found.`;
}
