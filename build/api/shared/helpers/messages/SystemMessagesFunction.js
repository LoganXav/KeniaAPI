"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESOURCE_FETCHED_SUCCESSFULLY = RESOURCE_FETCHED_SUCCESSFULLY;
exports.RESOURCE_RECORD_NOT_FOUND = RESOURCE_RECORD_NOT_FOUND;
exports.RESOURCE_RECORD_CREATED_SUCCESSFULLY = RESOURCE_RECORD_CREATED_SUCCESSFULLY;
exports.RESOURCE_RECORD_UPDATED_SUCCESSFULLY = RESOURCE_RECORD_UPDATED_SUCCESSFULLY;
exports.RESOURCE_RECORD_DELETED_SUCCESSFULLY = RESOURCE_RECORD_DELETED_SUCCESSFULLY;
exports.RESOURCE_RECORD_ALREADY_EXISTS = RESOURCE_RECORD_ALREADY_EXISTS;
exports.RESOURCE_RECORD_NOT_FOUND_WITH_ID = RESOURCE_RECORD_NOT_FOUND_WITH_ID;
function RESOURCE_FETCHED_SUCCESSFULLY(resourceName = "Resource") {
    return `${resourceName} fetched successfully.`;
}
function RESOURCE_RECORD_NOT_FOUND(resourceName = "Resource") {
    return `${resourceName} record was not found.`;
}
function RESOURCE_RECORD_CREATED_SUCCESSFULLY(resourceName = "Resource") {
    return `${resourceName} record created successfully.`;
}
function RESOURCE_RECORD_UPDATED_SUCCESSFULLY(resourceName = "Resource") {
    return `${resourceName} record updated successfully.`;
}
function RESOURCE_RECORD_DELETED_SUCCESSFULLY(resourceName = "Resource") {
    return `${resourceName} record deleted successfully.`;
}
function RESOURCE_RECORD_ALREADY_EXISTS(resourceName = "Resource") {
    return `${resourceName} record already exists.`;
}
function RESOURCE_RECORD_NOT_FOUND_WITH_ID(resourceName = "Resource", id = "ID") {
    return `${resourceName} record with ${id} was found.`;
}
//# sourceMappingURL=SystemMessagesFunction.js.map