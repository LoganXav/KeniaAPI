import { Request, Response, NextFunction } from "express";
import CryptoJS from "crypto-js";
import { Middleware } from "../../types";

export class EncryptionMiddleware {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.ENCRYPTION_KEY || "default-secret-key";
  }

  public handle: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res); // Bind res.json to maintain context

    // Overwrite res.json to encrypt the response data
    res.json = (data: any): Response => {
      try {
        if (process.env.NODE_ENV === "development") {
          return originalJson(data);
        }

        const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();

        const encryptedResponse = {
          encryptedPayload,
        };

        return originalJson(encryptedResponse);
      } catch (error) {
        console.error("Encryption Error:", error);
        return res.status(500).json({ error: "Failed to encrypt response" });
      }
    };

    next();
  };
}

// Export the class and the initialize method
export default new EncryptionMiddleware();
