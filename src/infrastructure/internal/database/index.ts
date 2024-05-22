import { singleton } from "tsyringe"
import { PrismaClient } from "@prisma/client"

@singleton()
export class Database {
  private client: PrismaClient

  constructor() {
    this.client = new PrismaClient()
  }

  public initializeClient(): PrismaClient {
    return this.client
  }

  public async disconnect(): Promise<void> {
    return await this.client.$disconnect()
  }
}
