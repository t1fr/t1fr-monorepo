import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigsModule, MongooseConfig } from "@t1fr/backend/configs";
import { MemberManageModule, MemberManageMongooseConnection } from "@t1fr/backend/member-manage";
import { PuppeteerModule } from "nestjs-puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { z } from "zod";
import { Controllers } from "./controller";
import { ConfigJwtOptionFactory, ManageMongooseOptionsFactory } from "./factory";
import { AccountDataScraper, AuthService } from "./service";

@Module({
    imports: [
        ConfigsModule.forRoot({
            schema: z.object({
                http: z.object({
                    cookie: z.object({
                        httpOnly: z.boolean(),
                        path: z.string(),
                        sameSite: z.string(),
                        maxAge: z.number(),
                        domain: z.string(),
                    }),
                }),
                jwt: z.object({
                    secret: z.string(),
                    signOptions: z.object({
                        expiresIn: z.string(),
                    }),
                }),
                database: z.object({
                    mongo: z.object({
                        manage: MongooseConfig,
                    }),
                }),
                gaijin: z.object({
                    username: z.string(),
                    password: z.string(),
                }),
            }),
        }),
        JwtModule.registerAsync({ useClass: ConfigJwtOptionFactory, global: true }),
        { ...HttpModule.register({}), global: true },
        CqrsModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forRootAsync({ useClass: ManageMongooseOptionsFactory, connectionName: MemberManageMongooseConnection }),
        MemberManageModule,
        PuppeteerModule.forRoot({
            headless: "new",
            args: ["--disable-notifications"],
            executablePath: process.env["CHROME_PATH"],
            plugins: [StealthPlugin()],
        })
    ],
    providers: [AuthService, AccountDataScraper],
    controllers: Controllers,
})
export class AppModule {
}
