import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

/**
 * This decorator is used to enforce the tenantId in the criteria object for used providers
 *
 * @param constructor
 * @returns
 */
export function EnforceTenantId<T extends { new (...args: any[]): object }>(constructor: T): T {
  return class extends constructor {
    [key: string]: any;

    constructor(...args: any[]) {
      super(...args);

      const methodNames = Object.getOwnPropertyNames(constructor.prototype).filter((prop) => typeof this[prop] === "function" && prop !== "constructor");

      for (const methodName of methodNames) {
        const originalMethod = this[methodName];

        this[methodName] = function (...args: any[]) {
          const hasTenantId = args.some((arg) => {
            if (typeof arg === "object" && arg !== null) {
              if (Array.isArray(arg)) {
                return arg.some((item) => typeof item === "object" && item !== null && typeof item.tenantId === "string");
              }
              return typeof arg.tenantId === "string";
            }
            return false;
          });

          if (!hasTenantId) {
            throw new InternalServerError(`Method "${methodName}" requires an argument parameter with a tenantId`);
          }

          return originalMethod.apply(this, args);
        };
      }
    }
  };
}
