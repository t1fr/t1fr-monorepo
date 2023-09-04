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

const intents = [
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildVoiceStates,
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent,
];

function configuration() {
	return load(readFileSync(join(__dirname, `config/${process.env.NODE_ENV}.yaml`), "utf-8")) as Record<string, any>;
}

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
		ScheduleModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: "mongodb://220.133.81.52:38422",
				user: "***REMOVED***",
				pass: "***REMOVED***",
				dbName: configService.getOrThrow("mongo.database"),
				authSource: "admin",
			}),
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
	],
})
export class AppModule {}
