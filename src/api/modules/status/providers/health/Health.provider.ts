import { IStatusProvider } from "../contracts/IStatus.provider";

export default class HealthProvider implements IStatusProvider {
  public async get(name: string, date: string): Promise<string> {
    // TODO -- Refactor to use express status monitor

    return Promise.resolve(`${name.toUpperCase()} api service is online at ${date}`);
  }
}
