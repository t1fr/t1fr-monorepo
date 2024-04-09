import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigsModule } from "@t1fr/backend/configs";
import { WikiModule } from "@t1fr/backend/wiki";
import { NecordModule } from "necord";
import { AcceptLanguageResolver, I18nModule, I18nYamlLoader } from "nestjs-i18n";
import * as path from "path";
import { CronTask } from "./CronTask";
import { VehicleMongooseOptionsFactory, WikiBotNecordOptionsFactory } from "./factory";
import { WikiAutocompleteInterceptor } from "./WikiAutocomplete";
import { WikiCommand } from "./WikiCommand";

@Module({
    imports: [
        ConfigsModule.forRoot(),
        I18nModule.forRoot({
            fallbackLanguage: "zh-TW",
            loaderOptions: { path: path.join(__dirname, "/i18n/"), watch: true },
            loader: I18nYamlLoader,
            resolvers: [AcceptLanguageResolver],
        }),
        CqrsModule.forRoot(),
        { ...HttpModule.register({}), global: true },
        NecordModule.forRootAsync({ useClass: WikiBotNecordOptionsFactory }),
        MongooseModule.forRootAsync({ useClass: VehicleMongooseOptionsFactory }),
        WikiModule,
    ],
    providers: [
        WikiCommand, WikiAutocompleteInterceptor, CronTask,
    ],
})
export class AppModule {
}
