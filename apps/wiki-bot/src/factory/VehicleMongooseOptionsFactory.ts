import { MongooseModuleOptions } from "@nestjs/mongoose";
import { ConfigParam, Configurable, MongooseConfig, MongooseOptionsFactory } from "@t1fr/backend/configs";

export class VehicleMongooseOptionsFactory extends MongooseOptionsFactory {

  @Configurable()
  getOptions(@ConfigParam("database.mongo.wiki") config?: MongooseConfig): MongooseModuleOptions {
    const options = VehicleMongooseOptionsFactory.convertConfig(config);
    return { ...options, appName: "wiki-bot" };
  }

  createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
    return this.getOptions();
  }
}
