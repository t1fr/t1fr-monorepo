import { Module } from "@nestjs/common";
import { ConfigsModule } from "@t1fr/backend/configs";
import { NecordModule } from "necord";
import { MongooseModule } from "@nestjs/mongoose";
import { VehicleMongooseOptionsFactory, WikiBotNecordOptionsFactory } from "./factory";
import { WikiModule } from "@t1fr/backend/wiki";
import { HttpModule } from "@nestjs/axios";
import { WikiCommand } from "./WikiCommand";
import { WikiAutocompleteInterceptor } from "./WikiAutocomplete";
import { CqrsModule } from "@nestjs/cqrs";
import { I18nModule } from "nestjs-i18n";
import * as path from "path";

@Module({
    imports: [
        ConfigsModule.forRoot(),
        I18nModule.forRoot({ fallbackLanguage: "zh-TW", loaderOptions: { path: path.join(__dirname, "/i18n/"), watch: true } }),
        CqrsModule.forRoot(),
        { ...HttpModule.register({}), global: true },
        NecordModule.forRootAsync({ useClass: WikiBotNecordOptionsFactory }),
        MongooseModule.forRootAsync({ useClass: VehicleMongooseOptionsFactory }),
        WikiModule,
    ],
    providers: [
        WikiCommand, WikiAutocompleteInterceptor,
    ],
})
export class AppModule {
}
