import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { union } from "lodash";
import { PuppeteerModule } from "nestjs-puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { MemberManageCommandHandler, MemberManageQueryHandlers } from "./application";
import { AccountModelDef, MemberManageInfraProvider, MemberManageMongooseConnection, MemberModelDef, MongoMemberQueryRepoProvider } from "./infrastructure";

@Module({
    imports: [
        PuppeteerModule.forRoot({ headless: "new", args: ["--disable-notifications"], plugins: [StealthPlugin()] }),
        MongooseModule.forFeature([MemberModelDef, AccountModelDef], MemberManageMongooseConnection),
    ],
    providers: union(MemberManageCommandHandler, MemberManageQueryHandlers, MemberManageInfraProvider),
    exports: [MongoMemberQueryRepoProvider]
})
export class MemberManageModule {
}
