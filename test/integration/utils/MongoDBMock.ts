import { MongoMemoryServer } from 'mongodb-memory-server';

export default class MongoDBMock {
  public mongod!: MongoMemoryServer;

  public uri!: string;

  async start(): Promise<void> {
    this.mongod = new MongoMemoryServer();
    this.uri = await this.mongod.getUri();
  }

  async stop(): Promise<void> {
    await this.mongod.stop();
  }
}
