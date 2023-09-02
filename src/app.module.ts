import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { ManagementModule } from "@/modules/management/management.module";
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";
import { ScheduleModule } from "@nestjs/schedule";
import LoggerModule from "@/modules/logging/logger.module";
import { MongooseModule } from "@nestjs/mongoose";

const intents = [
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildVoiceStates,
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent,
];

function configuration() {
	return load(readFileSync(join(__dirname, "config/config.yaml"), "utf-8")) as Record<string, any>;
}

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
		ScheduleModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: "mongodb://localhost:38422",
				// uri: "mongodb://220.133.81.52:38422",
				user: "t1fr",
				pass: "***REMOVED***",
				dbName: configService.getOrThrow("mongo.database"),
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
		ScheduleModule,
		LoggerModule,
	],
})
export class AppModule {}
