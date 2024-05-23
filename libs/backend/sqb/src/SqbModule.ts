import { Module, type Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { concat } from "lodash-es";
import { SqbCommandHandlers, SqbQueryHandlers } from "./application";
import { HistoryModelDef, MongoHistoryRepoProvider, MongooseSectionRepoProvider, MongoSquadronMatchRepoProvider, SectionModelDef, SqbMongooseConnection, SquadronMatchModelDef } from "./infrastructure";

@Module({
    imports: [MongooseModule.forFeature([SquadronMatchModelDef, HistoryModelDef, SectionModelDef], SqbMongooseConnection)],
    providers: concat<Provider>(SqbQueryHandlers, SqbCommandHandlers, MongoHistoryRepoProvider, MongooseSectionRepoProvider, MongoSquadronMatchRepoProvider),
})
export class SqbModule { }
