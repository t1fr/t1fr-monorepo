import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN, MemberManageModule } from "@t1fr/backend/member-manage";
import { ConfigJwtOptionFactory, ManageMongooseOptionsFactory } from "./factory";


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({ useClass: ConfigJwtOptionFactory, global: true }),
        CqrsModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forRootAsync({ useClass: ManageMongooseOptionsFactory, connectionName: MEMBER_MANAGE_MONGOOSE_CONNECTION_TOKEN }),
        MemberManageModule,
    ],
})
export class AppModule {
}
