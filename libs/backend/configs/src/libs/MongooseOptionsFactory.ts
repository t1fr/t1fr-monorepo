import { MongooseModuleOptions, MongooseOptionsFactory as BaseFactory } from "@nestjs/mongoose";
import { castArray, zip } from "lodash";

export interface MongooseConfig {
  host: string | string[];
  password: string;
  username: string;
  port: string | string[];
  database: string;
}

export abstract class MongooseOptionsFactory implements BaseFactory {
  protected static convertConfig(config: MongooseConfig): MongooseModuleOptions {
    const hosts = castArray(config.host);
    const ports = castArray(config.port);
    while (ports.length < hosts.length) ports.push(ports[0]);
    const addresses = zip(hosts, ports).map(([host, port]) => `${host}:${port}`);
    return {
      uri: `mongodb://${addresses.join(",")}`,
      dbName: config.database,
      pass: config.password,
      user: config.username,
    };
  }

  abstract createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions ;
}

