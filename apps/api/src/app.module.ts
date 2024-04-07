import { Module } from "@nestjs/common";
import { ManagementModule, ConnectionName } from "@t1fr/legacy/management";
import { BattleScheduleModule } from "@t1fr/legacy/schedule";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";


@Module({
  imports: [
    ManagementModule, BattleScheduleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    { ...HttpModule.register({}), global: true },
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: "mongodb://192.168.200.111:38422",
        user: "t1fr_admin",
        pass: "***REMOVED***",
        dbName: configService.getOrThrow("DATABASE"),
        authSource: "admin",
      }),
      connectionName: ConnectionName.Management,
    }),

    MongooseModule.forRoot("mongodb://192.168.200.111:38422", {
      user: "t1fr_admin",
      pass: "***REMOVED***",
      dbName: "common",
      authSource: "admin",
      connectionName: ConnectionName.Common,
    }),
    CqrsModule.forRoot(),
  ],
})
export class AppModule {
}
