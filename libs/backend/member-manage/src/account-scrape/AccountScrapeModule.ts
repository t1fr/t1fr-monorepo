import { DynamicModule } from "@nestjs/common";
import { PuppeteerModule } from "nestjs-puppeteer";
import * as process from "node:process";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { ScrapeAccountCommandToEvent, ScrapeAccountHandler } from "./ScrapeAccountHandler";
import { WebscraperAccountDatasourceProvider } from "./WebscraperAccountDatasouce";

export class AccountScrapeModule {
    static register(type: "edge" | "central"): Omit<DynamicModule, "module"> {
        if (type === "edge") {
            return {
                imports: [],
                providers: [
                    ScrapeAccountCommandToEvent,
                ],
            };
        } else {
            console.log(process.env["CHROME_PATH"]);
            return {
                imports: [PuppeteerModule.forRoot({
                    headless: "new",
                    args: ["--disable-notifications"],
                    executablePath: process.env["CHROME_PATH"],
                    plugins: [StealthPlugin()],
                })],
                providers: [
                    WebscraperAccountDatasourceProvider,
                    ScrapeAccountHandler,
                ],
            };
        }
    }
}