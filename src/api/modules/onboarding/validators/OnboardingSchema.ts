import { z } from "zod";
import DateTimeUtils from "~/utils/DateTimeUtil";

export const onboardingPersonalSchema = z.object({
  tenantId: z.number({
    required_error: "Tenant Id is required",
    invalid_type_error: "Tenant Id must be an integer",
  }),
  userId: z.number({
    required_error: "Auth User Id is required",
    invalid_type_error: "Auth User Id must be an integer",
  }),
  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, "First name must be at least 1 character")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(1, "Last name must be at least 1 character")
    .max(50, "Last name cannot exceed 50 characters"),

  gender: z.string({
    required_error: "Gender is required",
  }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
    })
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),

  dateOfBirth: z
    .string({
      invalid_type_error: "Date of birth must be a valid Date object",
    })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid date of birth format",
      }
    )
    .transform((val) => {
      if (!val) return null;
      return DateTimeUtils.parseToISO(val);
    }),
});

export const onboardingResidentialSchema = z.object({
  tenantId: z.number({
    required_error: "Tenant Id is required",
  }),
  userId: z.number({
    required_error: "Auth User Id is required",
  }),
  residentialAddress: z
    .string({
      required_error: "Residential address is required",
    })
    .min(1, "Residential address must be at least 1 character")
    .max(255, "Residential address is too long"),
  residentialLgaId: z.number({
    required_error: "Local government is required",
  }),
  residentialStateId: z.number({
    required_error: "State is required",
  }),
  residentialCountryId: z.number({
    required_error: "Country is required",
  }),
  residentialZipCode: z.number({
    required_error: "Zip code is required",
  }),
});

export const onboardingSchoolSchema = z.object({
  tenantId: z.number({
    required_error: "Tenant Id is required",
  }),
  userId: z.number({
    required_error: "Auth User Id is required",
  }),
  name: z
    .string({
      required_error: "School name is required",
    })
    .min(1, "School name must be at least 1 character")
    .max(100, "School name cannot exceed 100 characters"),
  registrationNo: z
    .string({
      required_error: "Registration number is required",
    })
    .min(1, "Registration number must be at least 1 character")
    .max(50, "Registration number cannot exceed 50 characters"),
  contactEmail: z
    .string({
      required_error: "School contact email is required",
    })
    .email("Invalid email address for school"),
  contactPhone: z
    .string({
      required_error: "School contact phone is required",
    })
    .min(10, "Contact phone must be at least 10 digits")
    .max(15, "Contact phone cannot exceed 15 digits"),

  establishedDate: z
    .string({
      invalid_type_error: "Established date must be a valid Date object",
    })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid established date format",
      }
    )
    .transform((val) => {
      if (!val) return null;
      return DateTimeUtils.parseToISO(val);
    }),

  logoUrl: z
    .string({
      invalid_type_error: "Logo URL must be a string",
    })
    // .url("Invalid URL for school logo")
    .optional(),
  address: z
    .string({
      required_error: "School address is required",
    })
    .min(1, "School address must be at least 1 character")
    .max(255, "School address is too long"),
  stateId: z.number({
    required_error: "School state is required",
  }),
  lgaId: z.number({
    required_error: "Local Government Area (LGA) is required",
  }),
  zipCode: z.number({
    required_error: "Zip Code is required",
  }),
  countryId: z.number({
    required_error: "Country is required",
  }),
  postalCode: z
    .string({
      required_error: "Postal Code is required",
    })
    .min(5, "Postal code must be at least 5 characters")
    .max(10, "Postal code cannot exceed 10 characters"),
});

export const onboardingTemplateParamsSchema = z.object({
  codeValue: z
    .string({
      required_error: "Code Value is required",
    })
    .optional(),
});
