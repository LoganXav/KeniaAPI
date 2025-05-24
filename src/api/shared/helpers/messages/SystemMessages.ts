/** <---------------> System Entities <---------------> */
export const STAFF = "staff";
export const STUDENT = "student";

/** <---------------> Resource Labels <---------------> */
export const USER_RESOURCE = "User";
export const STAFF_RESOURCE = "Staff";
export const STUDENT_RESOURCE = "Student";
export const TENANT_RESOURCE = "Tenant";
export const TEMPLATE_RESOURCE = "Template";
export const CLASS_RESOURCE = "Class";
export const CLASS_DIVISION_RESOURCE = "Class Division";
export const SUBJECT_RESOURCE = "Subject";
export const DOCUMENT_RESOURCE = "Document";
export const DOCUMENT_TYPE_RESOURCE = "Document Type";
export const DORMITORY_RESOURCE = "Dormitory";
export const STUDENT_GROUP_RESOURCE = "Student Group";
export const GUARDIAN_RESOURCE = "Guardian";
export const MEDICAL_HISTORY_RESOURCE = "Medical History";
export const SCHOOL_CALENDAR_RESOURCE = "School Calendar";
export const TERM_RESOURCE = "Term";
export const BREAK_PERIOD_RESOURCE = "Break Period";
export const TIMETABLE_RESOURCE = "Timetable";
export const PERIOD_RESOURCE = "Period";
export const ROLE_RESOURCE = "Role";
export const GRADING_STRUCTURE_RESOURCE = "Grading Structure";
/** <---------------> Success Responses <---------------> */
export const ACCOUNT_CREATED = "Account Created Successfully";
export const TOKEN_VERIFIED = "Token Verification Success";
export const TOKEN_REFRESH_SUCCESS = "Token Refresh Success";
export const SIGN_IN_SUCCESSFUL = "Sign In Successful";

/** <---------------> Error Responses <---------------> */
export const EMAIL_IN_USE = "Email is Already in Use";
export const INVALID_CREDENTIALS = "Invalid Credentials";
export const ACCOUNT_VERIFIED = "Token Already Used";
export const PROVIDER_NOT_FOUND = "Provider Not Found";
export const MIDDLEWARES_ATTACHED = "Middlewares Attached Successfully";

/** <---------------> Response Status <---------------> */
export const ERROR = "error";
export const SUCCESS = "success";

/** <---------------> Email Messages <---------------> */
export const EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT = "Kenia Email Activation";

/** <---------------> Role Labels <---------------> */
export const SCHOOL_OWNER_ROLE_NAME = "Proprietor";

/** <---------------> Server Errors <---------------> */
export const CRITICAL_ERROR_EXITING = "Application Encountered a Critical Error. Exiting";
export const INTERNAL_SERVER_ERROR = "Internal Server Error";
export const SOMETHING_WENT_WRONG = "Something went wrong while performing this operation";

/** <---------------> Error States <---------------> */
export const NULL_OBJECT = null;

/** <---------------> Password Reset Responses <---------------> */
export const PASSWORD_RESET_TOKEN_EMAIL_SUBJECT = "Kenia's Password Reset";
export const PASSWORD_RESET_LINK_GENERATED = "Password Recovery Link Generated. Please Check your mail";
export const PASSWORD_RESET_SUCCESSFULLY = "Password Changed Successfully";

/** <---------------> Authorization Responses <---------------> */
export const AUTHORIZATION_REQUIRED = "Unauthorized: You are not authorized to access this resource.";
export const VALIDATION_ERROR = "Validation Error";
export const ERROR_AUTHORIZATION_REQUIRED = "Authorization Required: Access token is missing or expired.";
export const ERROR_INVALID_TOKEN = "Invalid Token: The provided token is not valid.";
export const ERROR_EXPIRED_TOKEN = "Expired Token: The provided token has expired.";
export const ERROR_MISSING_TOKEN = "Missing Token: Access token is missing.";
export const TOKEN_EXPIRED = "This Token has Expired. Please Request a Fresh One.";

/** <---------------> CRUD Success <---------------> */
export const CREATED = "Created Successfully";
export const READ = "Read Successfully";
export const UPDATED = "Updated Successfully";
export const DELETED = "Delete Successfully";

/** <---------------> CRUD Errors <---------------> */
export const CREATE_ERROR = "Unable to Create";
export const READ_ERROR = "Unable to Read";
export const UPDATE_ERROR = "Unable to Update";
export const DELETE_ERROR = "Unable to Delete";
export const ALREADY_EXISTS = "Already Exists";
export const NOT_FOUND = "Not Found";
