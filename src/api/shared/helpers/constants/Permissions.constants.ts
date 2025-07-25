export const PERMISSIONS = {
  STAFF: {
    CREATE: "STAFF_CREATE",
    READ: "STAFF_READ",
    UPDATE: "STAFF_UPDATE",
    DELETE: "STAFF_DELETE",
  },
  STUDENT: {
    CREATE: "STUDENT_CREATE",
    READ: "STUDENT_READ",
    UPDATE: "STUDENT_UPDATE",
    DELETE: "STUDENT_DELETE",
  },
  CLASS: {
    CREATE: "CLASS_CREATE",
    READ: "CLASS_READ",
    UPDATE: "CLASS_UPDATE",
    DELETE: "CLASS_DELETE",
  },
  SUBJECT: {
    CREATE: "SUBJECT_CREATE",
    READ: "SUBJECT_READ",
    UPDATE: "SUBJECT_UPDATE",
    DELETE: "SUBJECT_DELETE",
  },
  TIMETABLE: {
    CREATE: "TIMETABLE_CREATE",
    READ: "TIMETABLE_READ",
    UPDATE: "TIMETABLE_UPDATE",
    DELETE: "TIMETABLE_DELETE",
  },
  CALENDAR: {
    CREATE: "CALENDAR_CREATE",
    READ: "CALENDAR_READ",
    UPDATE: "CALENDAR_UPDATE",
    DELETE: "CALENDAR_DELETE",
  },
  PERIOD: {
    CREATE: "PERIOD_CREATE",
    READ: "PERIOD_READ",
    UPDATE: "PERIOD_UPDATE",
    DELETE: "PERIOD_DELETE",
  },
  ROLE: {
    CREATE: "ROLE_CREATE",
    READ: "ROLE_READ",
    UPDATE: "ROLE_UPDATE",
    DELETE: "ROLE_DELETE",
  },
} as const;

export type PermissionConstantsType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];
