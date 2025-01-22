import { z } from "zod";
import { onboardingPersonalSchema } from "../validators/OnboardingSchema";

export type onboardingPersonalInformationDataType = z.infer<typeof onboardingPersonalSchema>;
