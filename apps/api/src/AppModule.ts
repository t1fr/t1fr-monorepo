import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigsModule } from "@t1fr/backend/configs";
import { MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN, MemberManageModule } from "@t1fr/backend/member-manage";
import { Controllers } from "./controller";
import { ConfigJwtOptionFactory, ManageMongooseOptionsFactory } from "./factory";
import { AuthService } from "./service";


@Module({
    imports: [
        ConfigsModule.forRoot(),
        JwtModule.registerAsync({ useClass: ConfigJwtOptionFactory, global: true }),
        { ...HttpModule.register({}), global: true },
        CqrsModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forRootAsync({ useClass: ManageMongooseOptionsFactory, connectionName: MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN }),
        MemberManageModule,
    ],
    providers: [AuthService],
    controllers: Controllers,
})
export class AppModule {
}
