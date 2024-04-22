import { HttpModule } from "@nestjs/axios";
import { Module, Provider } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigsModule } from "@t1fr/backend/configs";
import { MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN, MemberManageModule } from "@t1fr/backend/member-manage";
import { union } from "lodash";
import { NecordModule } from "necord";
import { DiscordCommands } from "./command";
import { ManageBotNecordOptionsFactory, ManageMongooseOptionsFactory } from "./factory";
import { DiscordClientService } from "./service";


@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigsModule.forRoot(),
        CqrsModule.forRoot(),
        { ...HttpModule.register({}), global: true },
        NecordModule.forRootAsync({ useClass: ManageBotNecordOptionsFactory }),
        MongooseModule.forRootAsync({ useClass: ManageMongooseOptionsFactory, connectionName: MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN }),
        MemberManageModule,
    ],
    providers: union<Provider>(DiscordCommands, [DiscordClientService]),

})
export class AppModule {
}
