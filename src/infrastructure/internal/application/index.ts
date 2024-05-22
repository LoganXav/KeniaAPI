import { Server, createServer } from "http"
import { DependencyContainer } from "tsyringe"
import AppSettings from "~/api/shared/setttings/AppSettings"
import { Database } from "~/infrastructure/internal/database"
import Express from "~/infrastructure/internal/express"

export class Application {
  container: DependencyContainer
  express: Express
  server: Server

  constructor(container: DependencyContainer) {
    this.container = container

    container.registerSingleton(Database)
    const dbClient: Database = this.container.resolve(Database)

    this.express = new Express(dbClient)
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
