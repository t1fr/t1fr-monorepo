import { AbstractMongooseOptionsFactory, Configuration, MongooseConfig } from "@t1fr/backend/configs";

export class SqbMongooseOptionsFactory extends AbstractMongooseOptionsFactory {
    @Configuration("database.mongo.sqb")
    protected config!: MongooseConfig;
}
