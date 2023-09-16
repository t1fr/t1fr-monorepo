import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { ManagementModule } from "@/modules/management/management.module";
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import LoggerModule from "@/modules/logging/logger.module";
import BattleModule from "@/modules/schedule/battle.module";
import * as process from "process";
import { ConnectionName } from "@/constant";
import { HttpModule } from "@nestjs/axios";
import { WikiModule } from "@/modules/wiki/wiki.module";

const intents = [
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildVoiceStates,
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent,
];

function configuration() {
	return load(readFileSync(join(__dirname, `config/${process.env.NODE_ENV}.yaml`), "utf-8")) as Record<string, unknown>;
}

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
		{ ...HttpModule.register({}), global: true },
		ScheduleModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: "mongodb://220.133.81.52:38422",
				user: "t1fr_admin",
				pass: "t1frOuO",
				dbName: configService.getOrThrow("mongo.database"),
				authSource: "admin",
			}),
			connectionName: ConnectionName.Management,
		}),

		MongooseModule.forRoot("mongodb://220.133.81.52:38422", {
			user: "t1fr_admin",
			pass: "t1frOuO",
			dbName: "common",
			authSource: "admin",
			connectionName: ConnectionName.Common,
		}),

		NecordModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				token: configService.getOrThrow("bot.token"),
				intents: intents,
				development: ["1046623840710705152"],
			}),
		}),
		ManagementModule,
		BattleModule,
		LoggerModule,
		WikiModule
	],
})
export class AppModule {}
