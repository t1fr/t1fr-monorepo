import type { MongooseConfig } from "@t1fr/backend/configs";
import { AbstractMongooseOptionsFactory, Configuration } from "@t1fr/backend/configs";

export class ManageMongooseOptionsFactory extends AbstractMongooseOptionsFactory {
    @Configuration("database.mongo.manage")
    protected config!: MongooseConfig;
}
