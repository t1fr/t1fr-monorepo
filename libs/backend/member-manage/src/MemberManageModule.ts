import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { union } from "lodash";
import { PuppeteerModule } from "nestjs-puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { MemberManageCommandHandler } from "./application";
import { AccountModelDef, MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN, MemberManageInfraProvider, MemberModelDef } from "./infrastructure";

@Module({
    imports: [
        PuppeteerModule.forRoot({ headless: false, args: ["--disable-notifications"], plugins: [StealthPlugin()] }),
        MongooseModule.forFeature([MemberModelDef, AccountModelDef], MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN),
    ],
    providers: union(MemberManageCommandHandler, MemberManageInfraProvider),
})
export class MemberManageModule {
}
