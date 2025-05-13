import CryptoJS from "crypto-js";
import ServerConfig from "~/config/ServerConfig";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
export class PayloadEncryptService {
  private static readonly KEY = CryptoJS.enc.Hex.parse(ServerConfig.Params.Security.Decrypt.Key);
  private static readonly IV = CryptoJS.enc.Hex.parse(ServerConfig.Params.Security.Decrypt.Iv);

  private static loggingProvider: ILoggingDriver = LoggingProviderFactory.build();

  static encrypt(result: Record<string, any>): Record<string, any> {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(result.data), PayloadEncryptService.KEY, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: PayloadEncryptService.IV,
      });

      let encryptedResult: Record<string, any> = {};

      if (ServerConfig.Environment == "development") {
        encryptedResult = { result: result.data, encoded: false };
      } else {
        encryptedResult = { result: encrypted.toString(), encoded: true };
      }

      return encryptedResult;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError("Error encrypting result");
    }
  }

  static decrypt(request: string): Record<string, any> {
    try {
      const decrypted = CryptoJS.AES.decrypt(request, PayloadEncryptService.KEY, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: PayloadEncryptService.IV,
      });

      // Convert decrypted WordArray to UTF-8 string
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      // Parse the decrypted text as JSON
      return JSON.parse(decryptedText);
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError("Error decrypting request");
    }
  }
}
