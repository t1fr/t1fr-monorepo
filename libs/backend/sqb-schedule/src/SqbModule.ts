import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { concat } from "lodash";
import { SqbCommandHandlers, SqbQueryHandlers } from "./application";
import { MongooseSectionRepoProvider, SectionModelDef, SqbMongooseConnection } from "./infrastructure";

@Module({
    imports: [MongooseModule.forFeature([SectionModelDef], SqbMongooseConnection)],
    providers: concat<Provider>(SqbQueryHandlers, SqbCommandHandlers, MongooseSectionRepoProvider),
    exports: [],
})
export class SqbModule {
}
