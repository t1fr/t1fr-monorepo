import { AbstractMongooseOptionsFactory, Configuration, type MongooseConfig } from "@t1fr/backend/configs";

export class VehicleMongooseOptionsFactory extends AbstractMongooseOptionsFactory {
    @Configuration("database.mongo.wiki")
    protected config!: MongooseConfig;
}
