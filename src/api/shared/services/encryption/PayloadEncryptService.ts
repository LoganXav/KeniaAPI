import CryptoJS from "crypto-js";
import ServerConfig from "~/config/ServerConfig";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

const KEY = CryptoJS.enc.Hex.parse(ServerConfig.Params.Security.Decrypt.Key);
const IV = CryptoJS.enc.Hex.parse(ServerConfig.Params.Security.Decrypt.Iv);

export class PayloadEncryptService {
  static encrypt(result: Record<string, any>): Record<string, any> {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(result.data), KEY, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: IV,
      });

      let encryptedResult: Record<string, any> = {};

      if (ServerConfig.Environment == "development") {
        encryptedResult = { result: result.data, encoded: false };
      } else {
        encryptedResult = { result: encrypted.toString(), encoded: true };
      }

      return encryptedResult;
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Error encrypting result");
    }
  }

  static decrypt(request: string): Record<string, any> {
    try {
      const decrypted = CryptoJS.AES.decrypt(request, KEY, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: IV,
      });

      // Convert decrypted WordArray to UTF-8 string
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      console.log(decryptedText, "decryptedTextdec");
      // Parse the decrypted text as JSON
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error(error);
      throw new InternalServerError("Error decrypting request");
    }
  }
}
