import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { concat } from "lodash";
import { SqbCommandHandlers, SqbQueryHandlers } from "./application";
import { MongooseSeasonRepoProvider, SeasonModelDef, SqbMongooseConnection } from "./infrastructure";

@Module({
    imports: [MongooseModule.forFeature([SeasonModelDef], SqbMongooseConnection)],
    providers: concat<Provider>(SqbQueryHandlers, SqbCommandHandlers, MongooseSeasonRepoProvider),
    exports: [],
})
export class SqbModule {
}
