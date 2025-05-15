import { SOMETHING_WENT_WRONG } from "~/api/shared/helpers/messages/SystemMessages";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
/**
 * This decorator is used to enforce the tenantId in the criteria object for used providers
 *
 * @param constructor
 * @returns
 */
export function EnforceTenantId<T extends { new (...args: any[]): object }>(constructor: T): T {
  const loggingProvider = LoggingProviderFactory.build();

  return class extends constructor {
    [key: string]: any;

    constructor(...args: any[]) {
      super(...args);

      const methodNames = Object.getOwnPropertyNames(constructor.prototype).filter((prop) => typeof this[prop] === "function" && prop !== "constructor");

      for (const methodName of methodNames) {
        const originalMethod = this[methodName];

        this[methodName] = function (...args: any[]) {
          console.log("args", args);

          const hasTenantId = args.some((arg) => {
            if (typeof arg === "object" && arg !== null) {
              if (Array.isArray(arg)) {
                return arg.some((item) => typeof item === "object" && item !== null && typeof item.tenantId === "string");
              }
              return typeof arg.tenantId === "number" || typeof arg.tenantId === "string";
            }
            return false;
          });

          if (!hasTenantId) {
            loggingProvider.error(`Missing tenantId`);
            throw new InternalServerError(SOMETHING_WENT_WRONG);
          }

          return originalMethod.apply(this, args);
        };
      }
    }
  };
}
