import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { concat } from "lodash-es";
import { SqbCommandHandlers, SqbQueryHandlers } from "./application";
import { HistoryModelDef, MongoHistoryRepoProvider, MongooseSectionRepoProvider, SectionModelDef, SqbMongooseConnection } from "./infrastructure";

@Module({
    imports: [MongooseModule.forFeature([HistoryModelDef, SectionModelDef], SqbMongooseConnection)],
    providers: concat<Provider>(SqbQueryHandlers, SqbCommandHandlers, MongoHistoryRepoProvider, MongooseSectionRepoProvider),
})
export class SqbModule {}
