import { Server, createServer } from "http"
import AppSettings from "~/api/shared/setttings/AppSettings"
import Express from "~/infrastructure/internal/express"

export class Application {
  express: Express
  server: Server

  constructor() {
    this.express = new Express()
    this.server = createServer(this.express.app)
  }

  start(): void {
    this.express
      .initializeServices()
      .then(() => {
        this.server.listen(AppSettings.ServerPort)
      })
      .catch((error: Error) => {
        this.express.loggingProvider.error(`Starting server error: ${error}`)
      })

    this.server.on("listening", () => {
      // TODO: Add Api Doc generator
      this.express.loggingProvider.info(
        `${AppSettings.ServiceName} Server running on ${AppSettings.ServerHost}:${AppSettings.ServerPort}${AppSettings.ServerRoot}`
      )
    })
  }
}
