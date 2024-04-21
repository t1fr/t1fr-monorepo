import { AbstractMongooseOptionsFactory, ConfigParam, Configurable, MongooseConfig } from "@t1fr/backend/configs";

export class ManageMongooseOptionsFactory extends AbstractMongooseOptionsFactory {
    @Configurable()
    getOptions(@ConfigParam("database.mongo.manage") config?: MongooseConfig): MongooseConfig | undefined {
        return config;
    }
}
