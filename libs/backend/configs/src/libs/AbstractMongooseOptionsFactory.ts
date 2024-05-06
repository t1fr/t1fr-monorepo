import { Logger } from "@nestjs/common";
import type { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { castArray, zip } from "lodash-es";
import { Error } from "mongoose";
import { z } from "zod";


export const MongooseConfig = z.object({
    host: z.string(),
    password: z.string(),
    username: z.string(),
    port: z.coerce.number(),
    database: z.string(),
});

export type MongooseConfig = z.infer<typeof MongooseConfig>

export abstract class AbstractMongooseOptionsFactory implements MongooseOptionsFactory {

    private static logger = new Logger(AbstractMongooseOptionsFactory.name);

    protected readonly abstract config: MongooseConfig;

    protected static convertConfig(config: MongooseConfig): MongooseModuleOptions {
        const { host, port, password, username, database, ...other } = config;
        const hosts = castArray(host);
        const ports = castArray(port);
        while (ports.length < hosts.length) ports.push(ports[0]);
        const addresses = zip(hosts, ports).map(([host, port]) => `${host}:${port}`);
        return {
            ...other,
            uri: `mongodb://${addresses.join(",")}`,
            dbName: database,
            pass: password,
            user: username,
            connectionFactory: (connection, name) => {
                connection.on("connected", () => this.logger.log(`${name}(mongoose): 已連上 ${connection.host}:${connection.port} 資料庫 ${connection.name} 集合`));
                connection._events.connected();
                return connection;
            },
        };
    }

    createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
        if (!this.config) throw new Error("Cannot get mongoose options");
        return AbstractMongooseOptionsFactory.convertConfig(this.config);
    }
}

