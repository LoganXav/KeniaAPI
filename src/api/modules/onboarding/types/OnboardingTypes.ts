import { z } from "zod";
import { onboardingPersonalSchema, onboardingResidentialSchema, onboardingSchoolSchema } from "../validators/OnboardingSchema";

export type onboardingPersonalInformationDataType = z.infer<typeof onboardingPersonalSchema>;
export type onboardingResidentialInformationDataType = z.infer<typeof onboardingResidentialSchema>;
export type onboardingSchoolInformationDataType = z.infer<typeof onboardingSchoolSchema>;
