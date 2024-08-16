import { TokenType, UserType } from "@prisma/client";

export interface ReadOneTokenRecordType {
  token?: string;
  userId?: number;
  tokenType?: TokenType;
  expired?: boolean;
  isActive?: boolean;
}

export interface ReadTokenRecordType {
  userId?: number;
  tokenType?: TokenType;
}

export interface UpdateTokenRecordType {
  tokenId?: number;
  expired?: boolean;
  isActive?: boolean;
}

export interface SignInUserResponseType {
  id: number;
  tenantId: number;
}
export interface SignUpUserResponseType {
  id: number;
  tenantId: number;
}

export interface VerifyOtpTokenResponseType {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  hasVerified: boolean;
  isFirstTimeLogin: boolean;
  lastLoginDate: Date;
  userType: UserType;
  tenantId: number;
}

export type RefreshOtpTokenResponseType = null;
