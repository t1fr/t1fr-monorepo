import { HttpModule } from "@nestjs/axios";
import { Module, Provider } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigsModule } from "@t1fr/backend/configs";
import { MemberManageModule, MemberManageMongooseConnection } from "@t1fr/backend/member-manage";
import { SqbModule, SqbMongooseConnection } from "@t1fr/backend/sqb-schedule";
import { concat } from "lodash";
import { NecordModule } from "necord";
import { AccountAutocompleteInterceptor } from "./autocomplete";
import { DiscordCommands } from "./command";
import { ManageBotNecordOptionsFactory, ManageMongooseOptionsFactory, SqbMongooseOptionsFactory } from "./factory";
import { DiscordClientService, DiscordListener } from "./service";


@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigsModule.forRoot(),
        CqrsModule.forRoot(),
        { ...HttpModule.register({}), global: true },
        NecordModule.forRootAsync({ useClass: ManageBotNecordOptionsFactory }),
        MongooseModule.forRootAsync({ useClass: ManageMongooseOptionsFactory, connectionName: MemberManageMongooseConnection }),
        MongooseModule.forRootAsync({ useClass: SqbMongooseOptionsFactory, connectionName: SqbMongooseConnection }),
        MemberManageModule,
        SqbModule,
    ],
    providers: concat<Provider>(DiscordCommands, DiscordClientService, AccountAutocompleteInterceptor, DiscordListener),

})
export class AppModule {
}
