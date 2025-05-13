import { Normalize } from "~/config/Normalize";
import { BooleanUtil } from "~/utils/BooleanUtil";
import { DefaultValue } from "~/utils/DefaultValue";
import { ServiceContext } from "~/api/shared/helpers/enums/ServiceContext.enum";

export const DEV = "development";

if (!process.env?.NODE_ENV || BooleanUtil.areEqual(process.env.NODE_ENV, DEV)) console.log("Running in dev mode");

const serviceContext = DefaultValue.evaluateAndGet(process.env.SERVICE_CONTEXT, ServiceContext.KENIA_EXPRESS);

export default {
  Environment: DefaultValue.evaluateAndGet(process.env.NODE_ENV, DEV),
  Controllers: {
    ContextPaths: [
      // If you have business logic in multiple contexts -- similar to microservices
      Normalize.pathFromOS(Normalize.absolutePath(__dirname, "../api/modules/status/**.controller.??")),
      Normalize.pathFromOS(Normalize.absolutePath(__dirname, `../api/modules/${serviceContext}/controllers/**.controller.??`)),
    ],
    DefaultPath: [Normalize.pathFromOS(Normalize.absolutePath(__dirname, "../api/modules/**/controllers/**.controller.??"))],
    Ignore: [Normalize.pathFromOS("**/base")],
  },
  Server: {
    Root: DefaultValue.evaluateAndGet(process.env.SERVER_ROOT, "/api"),
    Host: DefaultValue.evaluateAndGet(process.env.SERVER_HOST, "localhost"),
    Port: DefaultValue.evaluateAndGet(Number(process.env.PORT), 5500),
    Origins: DefaultValue.evaluateAndGet(process.env.ORIGINS, "http://localhost:3000,http://localhost:3001,http://localhost:3002,https://kenia-client-monorepo-web.vercel.app"),
    ServiceName: DefaultValue.evaluateAndGet(process.env.SERVICE_NAME, "KENIA"),
    ServiceContext: {
      LoadWithContext: !!process.env.SERVICE_CONTEXT,
      Context: serviceContext,
    },
  },
  Cache: {
    Url: DefaultValue.evaluateAndGet(process.env.CACHE_URL, "redis://kenia_redis:6379"),
  },
  Params: {
    DefaultHealthRemoteService: DefaultValue.evaluateAndGet(process.env.REMOTE_HEALTH_SERVICE, "https://google.com"),

    Security: {
      JWT: {
        SecretKey: process.env.JWT_SECRET_KEY,
        ExpireInSeconds: DefaultValue.evaluateAndGet(parseInt(process.env.JWT_EXPIRATION_TIME!, 10), 3600),
      },
      Bcrypt: {
        SaltRounds: parseInt(process.env["BCRYPT_SALT_ROUNDS"]!, 10),
      },
      Decrypt: {
        Key: process.env.AES_ENCRYPTION_KEY!,
        Iv: process.env.AES_ENCRYPTION_IV!,
      },
      DefaultPassword: {
        Staff: process.env.DEFAULT_STAFF_PASSWORD!,
        Student: process.env.DEFAULT_STUDENT_PASSWORD!,
      },
    },
  },

  ApiDocsInfo: {
    title: "Kenia API",
    version: "1.0.0",
    description: "Api documentation for Kenia",
    contact: {
      name: "KeniaAPI",
      url: "https://github.com/Loganxav/KeniaAPI",
      email: "sogbesansegun22@gmail.com",
    },
  },
};
