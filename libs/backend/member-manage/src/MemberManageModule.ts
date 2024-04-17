import { Module } from "@nestjs/common";
import { PuppeteerModule } from "nestjs-puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

@Module({
    imports: [PuppeteerModule.forRoot({ headless: true, args: ["--disable-notifications"], plugins: [StealthPlugin()] })],
    controllers: [],
    providers: [],
    exports: [],
})
export class MemberManageModule {
}
