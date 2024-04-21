import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigsModule } from "@t1fr/backend/configs";
import { MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN, MemberManageModule } from "@t1fr/backend/member-manage";
import { NecordModule } from "necord";
import { AccountCommand } from "./command";
import { ManageBotNecordOptionsFactory, ManageMongooseOptionsFactory } from "./factory";


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
    providers: [
        AccountCommand,
        // MemberCommand, MemberUserCommand, DiscordListener, ScheduleCommand, PointCommand
    ],

})
export class AppModule {
}
