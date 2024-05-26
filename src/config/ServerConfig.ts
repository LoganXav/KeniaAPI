import { BooleanUtil } from "~/utils/BooleanUtil"
import { DefaultValue } from "~/utils/DefaultValue"
import { Normalize } from "./Normalize"
import { ServiceContext } from "~/api/shared/helpers/enums/ServiceContext.enum"

const DEV = "development"

if (!process.env?.NODE_ENV || BooleanUtil.areEqual(process.env.NODE_ENV, DEV))
  console.log("Running in dev mode")

const serviceContext = DefaultValue.evaluateAndGet(
  process.env.SERVICE_CONTEXT,
  ServiceContext.KENIA_EXPRESS
)

export default {
  Environment: DefaultValue.evaluateAndGet(process.env.NODE_ENV, DEV),
  Controllers: {
    ContextPaths: [
      // If you have business logic in multiple contexts -- similar to microservices
      Normalize.pathFromOS(
        Normalize.absolutePath(
          __dirname,
          "../api/modules/status/**.controller.??"
        )
      ),
      Normalize.pathFromOS(
        Normalize.absolutePath(
          __dirname,
          `../api/modules/${serviceContext}/controllers/**.controller.??`
        )
      )
    ],
    DefaultPath: [
      Normalize.pathFromOS(
        Normalize.absolutePath(
          __dirname,
          "../api/modules/**/controllers/**.controller.??"
        )
      )
    ],
    Ignore: [Normalize.pathFromOS("**/base")]
  },
  Server: {
    Root: DefaultValue.evaluateAndGet(process.env.SERVER_ROOT, "/api"),
    Host: DefaultValue.evaluateAndGet(process.env.SERVER_HOST, "localhost"),
    Port: DefaultValue.evaluateAndGet(Number(process.env.SERVER_PORT), 5000),
    Origins: DefaultValue.evaluateAndGet(
      process.env.ORIGINS,
      "http://localhost:3000,http://localhost:3001,http://localhost:3002"
    ),
    ServiceName: DefaultValue.evaluateAndGet(process.env.SERVICE_NAME, "KENIA"),
    ServiceContext: {
      LoadWithContext: !!process.env.SERVICE_CONTEXT,
      Context: serviceContext
    }
  },
  Params: {
    DefaultHealthRemoteService: DefaultValue.evaluateAndGet(
      process.env.REMOTE_HEALTH_SERVICE,
      "https://google.com"
    ),

    Security: {
      JWT: {
        SecretKey: process.env.JWT_SECRET_KEY,
        ExpireInSeconds: 3600
      },
      Bcrypt: {
        SaltRounds: parseInt(process.env["BCRYPT_SALT_ROUNDS"]!, 10)
      }
    }
  }
}
