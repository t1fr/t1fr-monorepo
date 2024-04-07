import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { CqrsModule } from "@nestjs/cqrs";
import { ConnectionName } from "./constant";
import { ManagementModule } from "@t1fr/legacy/management";
import { BattleScheduleModule } from "@t1fr/legacy/schedule";
import { DiscordListener } from "./listener";
import { AccountCommand, MemberCommand, MemberUserCommand, PointCommand, ScheduleCommand } from "./command";

const intents = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildVoiceStates,
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
];

@Module({
  imports: [
    ManagementModule, BattleScheduleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    { ...HttpModule.register({}), global: true },
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: "mongodb://114.32.177.157:38422",
        user: "t1fr_admin",
        pass: "***REMOVED***",
        dbName: configService.getOrThrow("DATABASE"),
        authSource: "admin",
      }),
      connectionName: ConnectionName.Management,
    }),

    MongooseModule.forRoot("mongodb://114.32.177.157:38422", {
      user: "t1fr_admin",
      pass: "***REMOVED***",
      dbName: "common",
      authSource: "admin",
      connectionName: ConnectionName.Common,
    }),
    CqrsModule.forRoot(),

    NecordModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow("BOT_TOKEN"),
        intents: intents,
        development: ["1046623840710705152"],
      }),
    }),
  ],
  providers: [AccountCommand, MemberCommand, MemberUserCommand, DiscordListener, ScheduleCommand, PointCommand],

})
export class AppModule {
}
