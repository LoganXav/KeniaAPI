"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATED = exports.TOKEN_EXPIRED = exports.ERROR_MISSING_TOKEN = exports.ERROR_EXPIRED_TOKEN = exports.ERROR_INVALID_TOKEN = exports.ERROR_AUTHORIZATION_REQUIRED = exports.VALIDATION_ERROR = exports.AUTHORIZATION_REQUIRED = exports.PASSWORD_RESET_SUCCESSFULLY = exports.PASSWORD_RESET_LINK_GENERATED = exports.PASSWORD_RESET_TOKEN_EMAIL_SUBJECT = exports.NULL_OBJECT = exports.SOMETHING_WENT_WRONG = exports.INTERNAL_SERVER_ERROR = exports.CRITICAL_ERROR_EXITING = exports.SCHOOL_OWNER_ROLE_RANK = exports.SCHOOL_OWNER_ROLE_NAME = exports.EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT = exports.SUCCESS = exports.ERROR = exports.MIDDLEWARES_ATTACHED = exports.PROVIDER_NOT_FOUND = exports.ACCOUNT_VERIFIED = exports.INVALID_CREDENTIALS = exports.EMAIL_IN_USE = exports.SIGN_IN_SUCCESSFUL = exports.TOKEN_REFRESH_SUCCESS = exports.TOKEN_VERIFIED = exports.ACCOUNT_CREATED = exports.PERIOD_RESOURCE = exports.TIMETABLE_RESOURCE = exports.BREAK_PERIOD_RESOURCE = exports.TERM_RESOURCE = exports.SCHOOL_CALENDAR_RESOURCE = exports.MEDICAL_HISTORY_RESOURCE = exports.GUARDIAN_RESOURCE = exports.STUDENT_GROUP_RESOURCE = exports.DORMITORY_RESOURCE = exports.DOCUMENT_TYPE_RESOURCE = exports.DOCUMENT_RESOURCE = exports.SUBJECT_RESOURCE = exports.CLASS_DIVISION_RESOURCE = exports.CLASS_RESOURCE = exports.TEMPLATE_RESOURCE = exports.TENANT_RESOURCE = exports.STUDENT_RESOURCE = exports.STAFF_RESOURCE = exports.USER_RESOURCE = exports.STUDENT = exports.STAFF = void 0;
exports.NOT_FOUND = exports.ALREADY_EXISTS = exports.DELETE_ERROR = exports.UPDATE_ERROR = exports.READ_ERROR = exports.CREATE_ERROR = exports.DELETED = exports.UPDATED = exports.READ = void 0;
/** <---------------> System Entities <---------------> */
exports.STAFF = "staff";
exports.STUDENT = "student";
/** <---------------> Resource Labels <---------------> */
exports.USER_RESOURCE = "User";
exports.STAFF_RESOURCE = "Staff";
exports.STUDENT_RESOURCE = "Student";
exports.TENANT_RESOURCE = "Tenant";
exports.TEMPLATE_RESOURCE = "Template";
exports.CLASS_RESOURCE = "Class";
exports.CLASS_DIVISION_RESOURCE = "Class Division";
exports.SUBJECT_RESOURCE = "Subject";
exports.DOCUMENT_RESOURCE = "Document";
exports.DOCUMENT_TYPE_RESOURCE = "Document Type";
exports.DORMITORY_RESOURCE = "Dormitory";
exports.STUDENT_GROUP_RESOURCE = "Student Group";
exports.GUARDIAN_RESOURCE = "Guardian";
exports.MEDICAL_HISTORY_RESOURCE = "Medical History";
exports.SCHOOL_CALENDAR_RESOURCE = "School Calendar";
exports.TERM_RESOURCE = "Term";
exports.BREAK_PERIOD_RESOURCE = "Break Period";
exports.TIMETABLE_RESOURCE = "Timetable";
exports.PERIOD_RESOURCE = "Period";
/** <---------------> Success Responses <---------------> */
exports.ACCOUNT_CREATED = "Account Created Successfully";
exports.TOKEN_VERIFIED = "Token Verification Success";
exports.TOKEN_REFRESH_SUCCESS = "Token Refresh Success";
exports.SIGN_IN_SUCCESSFUL = "Sign In Successful";
/** <---------------> Error Responses <---------------> */
exports.EMAIL_IN_USE = "Email is Already in Use";
exports.INVALID_CREDENTIALS = "Invalid Credentials";
exports.ACCOUNT_VERIFIED = "Token Already Used";
exports.PROVIDER_NOT_FOUND = "Provider Not Found";
exports.MIDDLEWARES_ATTACHED = "Middlewares Attached Successfully";
/** <---------------> Response Status <---------------> */
exports.ERROR = "error";
exports.SUCCESS = "success";
/** <---------------> Email Messages <---------------> */
exports.EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT = "Kenia Email Activation";
/** <---------------> Role Labels <---------------> */
exports.SCHOOL_OWNER_ROLE_NAME = "Proprietor";
exports.SCHOOL_OWNER_ROLE_RANK = 1;
/** <---------------> Server Errors <---------------> */
exports.CRITICAL_ERROR_EXITING = "Application Encountered a Critical Error. Exiting";
exports.INTERNAL_SERVER_ERROR = "Internal Server Error";
exports.SOMETHING_WENT_WRONG = "Something went wrong while performing this operation";
/** <---------------> Error States <---------------> */
exports.NULL_OBJECT = null;
/** <---------------> Password Reset Responses <---------------> */
exports.PASSWORD_RESET_TOKEN_EMAIL_SUBJECT = "Kenia's Password Reset";
exports.PASSWORD_RESET_LINK_GENERATED = "Password Recovery Link Generated. Please Check your mail";
exports.PASSWORD_RESET_SUCCESSFULLY = "Password Changed Successfully";
/** <---------------> Authorization Responses <---------------> */
exports.AUTHORIZATION_REQUIRED = "Unauthorized: You are not authorized to access this resource.";
exports.VALIDATION_ERROR = "Validation Error";
exports.ERROR_AUTHORIZATION_REQUIRED = "Authorization Required: Access token is missing or expired.";
exports.ERROR_INVALID_TOKEN = "Invalid Token: The provided token is not valid.";
exports.ERROR_EXPIRED_TOKEN = "Expired Token: The provided token has expired.";
exports.ERROR_MISSING_TOKEN = "Missing Token: Access token is missing.";
exports.TOKEN_EXPIRED = "This Token has Expired. Please Request a Fresh One.";
/** <---------------> CRUD Success <---------------> */
exports.CREATED = "Created Successfully";
exports.READ = "Read Successfully";
exports.UPDATED = "Updated Successfully";
exports.DELETED = "Delete Successfully";
/** <---------------> CRUD Errors <---------------> */
exports.CREATE_ERROR = "Unable to Create";
exports.READ_ERROR = "Unable to Read";
exports.UPDATE_ERROR = "Unable to Update";
exports.DELETE_ERROR = "Unable to Delete";
exports.ALREADY_EXISTS = "Already Exists";
exports.NOT_FOUND = "Not Found";
//# sourceMappingURL=SystemMessages.js.map