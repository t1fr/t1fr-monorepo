import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { union } from "lodash";
import { AccountScrapeModule } from "./account-scrape";
import { MemberManageCommandHandler, MemberManageQueryHandlers } from "./application";
import {
    AccountModelDef,
    BackupModelDef,
    MemberManageInfraProvider,
    MemberManageMongooseConnection,
    MemberModelDef,
    MongoMemberQueryRepoProvider,
} from "./infrastructure";

@Module({
    imports: [MongooseModule.forFeature([MemberModelDef, AccountModelDef, BackupModelDef], MemberManageMongooseConnection)],
    providers: union(MemberManageCommandHandler, MemberManageQueryHandlers, MemberManageInfraProvider),
    exports: [MongoMemberQueryRepoProvider],
})
export class MemberManageModule {
    static register(syncAccount: boolean): DynamicModule {
        const scrape = AccountScrapeModule.register(syncAccount ? "central" : "edge");
        return {
            module: MemberManageModule,
            imports: scrape.imports,
            providers: scrape.providers,
        };
    }
}
