interface IStatusProvider{
    get(context: string, date: string): Promise<string>;
}

export default class HealthProvider implements IStatusProvider{
    public async get(context: string, date: string): Promise<string> {
        return Promise.resolve(
            `<h2>${context} api service is running ${date}</h2>`
        )
    }
}