export function RESOURCE_FETCHED_SUCCESSFULLY(resourceName = "Resource") {
  return ` ${resourceName} Fetched Successfully`
}

export function RESOURCE_RECORD_NOT_FOUND(resourceName = "Resource") {
  return `${resourceName} Record Was not found`
}

export function RESOURCE_RECORD_CREATED_SUCCESSFULLY(
  resourceName = "Resource"
) {
  return `${resourceName} Record Created Successfully`
}

export function RESOURCE_RECORD_UPDATED_SUCCESSFULLY(
  resourceName = "Resource"
) {
  return `${resourceName} Record Updated Successfully`
}
