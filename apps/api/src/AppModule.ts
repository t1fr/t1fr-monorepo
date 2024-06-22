import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigsModule, MongooseConfig } from "@t1fr/backend/configs";
import { MemberManageModule, MemberManageMongooseConnection } from "@t1fr/backend/member-manage";
import { SqbModule, SqbMongooseConnection } from "@t1fr/backend/sqb";
import { CookieSessionModule, } from 'nestjs-cookie-session';
import { PuppeteerModule } from "nestjs-puppeteer";
import { z } from "zod";
import { Controllers } from "./controller";
import { ManageMongooseOptionsFactory, SqbMongooseOptionsFactory } from "./factory";
import { AccountDataScraper, AuthService } from "./service";
@Module({
    imports: [
        ConfigsModule.forRoot({
            schema: z.object({
                app: z.object({
                    port: z.number(),
                    "cookie-session": z.object({
                        secret: z.string(),
                        httpOnly: z.boolean(),
                        path: z.string(),
                        sameSite: z.string(),
                        domain: z.string(),
                    }),
                }),
                database: z.object({
                    mongo: z.object({
                        manage: MongooseConfig,
                        sqb: MongooseConfig,
                    }),
                }),
                gaijin: z.object({
                    username: z.string(),
                    password: z.string(),
                }),
            }),
        }),
        CookieSessionModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({ session: configService.getOrThrow("app.cookie-session"), })
        }),

        { ...HttpModule.register({}), global: true },
        CqrsModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forRootAsync({ useClass: ManageMongooseOptionsFactory, connectionName: MemberManageMongooseConnection }),
        MongooseModule.forRootAsync({ useClass: SqbMongooseOptionsFactory, connectionName: SqbMongooseConnection }),
        MemberManageModule,
        SqbModule,
        PuppeteerModule.forRoot({
            headless: "new",
            args: ["--disable-notifications", '--no-sandbox'],
            executablePath: process.env["CHROME_PATH"],
        })
    ],
    providers: [AuthService, AccountDataScraper],
    controllers: Controllers,
})
export class AppModule {
}
