import { IStatusProvider } from "../contracts/IStatus.provider"

export default class HealthProvider implements IStatusProvider {
  public async get(context: string, date: string): Promise<string> {
    // TODO -- Refactor to use express status monitor

    return Promise.resolve(
      `<div><h2>${context} api service is online at ${date}</h2></div>`
    )
  }
}
