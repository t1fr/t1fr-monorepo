import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { CqrsModule } from "@nestjs/cqrs";
import { DiscordBotModule } from "./modules/bot/bot.module";
import { AuthModule } from "./modules/auth/auth.module";
import LoggerModule from "./modules/logging/logger.module";
import { ConnectionName } from "./constant";

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

		NecordModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				token: configService.getOrThrow("BOT_TOKEN"),
				intents: intents,
				development: ["1046623840710705152"],
			}),
		}),
		CqrsModule.forRoot(),
		DiscordBotModule,
		AuthModule,
		LoggerModule,
	],
})
export class AppModule {
}
