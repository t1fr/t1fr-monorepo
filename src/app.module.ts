import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { SquadronModule } from "@/modules/squadron/squadron.module";
import { GlobalHttpModule } from "@/modules/http/http.module";
import RewardModule from "@/modules/point/reward/reward.module";
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";
import BattleScheduleModule from "@/modules/battle-schedule/battle-schedule.module";
import BotConfigModule from "@/modules/bot-config/bot-config.module";
import { ScheduleModule } from "@nestjs/schedule";
import LoggerModule from "@/modules/logging/logger.module";

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
		NecordModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				token: configService.getOrThrow("bot.token"),
				intents: intents,
				development: ["1046623840710705152"],
			}),
		}),
		GlobalHttpModule,
		SquadronModule,
		RewardModule,
		BattleScheduleModule,
		BotConfigModule,
		LoggerModule,
	],
})
export class AppModule {}
