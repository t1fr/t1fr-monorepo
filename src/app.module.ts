import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { ManagementModule } from "@/modules/management/management.module";
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";
import { MongooseModule } from "@nestjs/mongoose";
import LoggerModule from "@/modules/logging/logger.module";
import * as process from "process";
import { ConnectionName } from "@/constant";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import DiscordBotModule from "@/modules/bot/bot.module";
import { BattleScheduleModule } from "@/modules/schedule/schedule.module";

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
		ConfigModule.forRoot({ isGlobal: true }),
		{ ...HttpModule.register({}), global: true },
		ScheduleModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: "mongodb://220.133.81.52:38422",
				user: "***REMOVED***",
				pass: "***REMOVED***",
				dbName: configService.getOrThrow("DATABASE"),
				authSource: "admin",
			}),
			connectionName: ConnectionName.Management,
		}),

		MongooseModule.forRoot("mongodb://220.133.81.52:38422", {
			user: "***REMOVED***",
			pass: "***REMOVED***",
			dbName: "common",
			authSource: "admin",
			connectionName: ConnectionName.Common,
		}),

		NecordModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				token: configService.getOrThrow("BOT_TOKEN"),
				intents: intents,
				development: ["1046623840710705152"],
			}),
		}),
		BattleScheduleModule,
		DiscordBotModule,
		ManagementModule,
		LoggerModule,
	],
})
export class AppModule {}
