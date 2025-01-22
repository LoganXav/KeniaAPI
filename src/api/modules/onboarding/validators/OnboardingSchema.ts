import { z } from "zod";

export const onboardingPersonalSchema = z.object({
  userId: z.number({
    required_error: "Id is required",
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
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),
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
        if (val) {
          return !isNaN(Date.parse(val));
        }
        return true;
      },
      {
        message: "Invalid date of birth format",
      }
    )
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const onboardingResidentialSchema = z.object({
  residentialAddress: z
    .string({
      required_error: "Residential address is required",
    })
    .min(1, "Residential address must be at least 1 character")
    .max(255, "Residential address is too long"),
  residentialCity: z
    .string({
      required_error: "City is required",
    })
    .min(1, "City must be at least 1 character")
    .max(50, "City name cannot exceed 50 characters"),
  residentialState: z
    .string({
      required_error: "State is required",
    })
    .min(1, "State must be at least 1 character")
    .max(50, "State name cannot exceed 50 characters"),
  residentialCountry: z
    .string({
      required_error: "Country is required",
    })
    .min(1, "Country must be at least 1 character")
    .max(50, "Country name cannot exceed 50 characters"),
  residentialZipCode: z
    .string({
      required_error: "Zip code is required",
    })
    .min(5, "Zip code must be at least 5 characters")
    .max(10, "Zip code cannot exceed 10 characters"),
});

export const onboardingSchoolSchema = z.object({
  // School Information
  name: z
    .string({
      required_error: "School name is required",
    })
    .min(1, "School name must be at least 1 character")
    .max(100, "School name cannot exceed 100 characters"),
  schoolType: z
    .string({
      required_error: "School type is required",
    })
    .min(1, "School type must be at least 1 character")
    .max(50, "School type cannot exceed 50 characters"),
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
      required_error: "Established date is required",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format for established date",
    }),
  logoUrl: z
    .string({
      invalid_type_error: "Logo URL must be a string",
    })
    .url("Invalid URL for school logo")
    .optional(),
  address: z
    .string({
      required_error: "School address is required",
    })
    .min(1, "School address must be at least 1 character")
    .max(255, "School address is too long"),
  city: z
    .string({
      required_error: "School city is required",
    })
    .min(1, "School city must be at least 1 character")
    .max(50, "School city name cannot exceed 50 characters"),
  state: z
    .string({
      required_error: "School state is required",
    })
    .min(1, "School state must be at least 1 character")
    .max(50, "School state name cannot exceed 50 characters"),
  lga: z
    .string({
      required_error: "Local Government Area (LGA) is required",
    })
    .min(1, "LGA must be at least 1 character")
    .max(50, "LGA cannot exceed 50 characters"),
  postalCode: z
    .string({
      required_error: "Postal code is required",
    })
    .min(5, "Postal code must be at least 5 characters")
    .max(10, "Postal code cannot exceed 10 characters"),
  ownershipType: z
    .string({
      required_error: "Ownership type is required",
    })
    .min(1, "Ownership type must be at least 1 character")
    .max(50, "Ownership type cannot exceed 50 characters"),
});
