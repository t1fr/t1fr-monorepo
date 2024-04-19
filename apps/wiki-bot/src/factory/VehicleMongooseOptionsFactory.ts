import { AbstractMongooseOptionsFactory, ConfigParam, Configurable, MongooseConfig } from "@t1fr/backend/configs";

export class VehicleMongooseOptionsFactory extends AbstractMongooseOptionsFactory {
  @Configurable()
  getOptions(@ConfigParam("database.mongo.wiki") config?: MongooseConfig): MongooseConfig | undefined{
    return config;
  }
}
