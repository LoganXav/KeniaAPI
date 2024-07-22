import { TokenType } from "@prisma/client";

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
