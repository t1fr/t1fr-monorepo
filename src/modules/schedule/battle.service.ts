import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ChannelType, Client } from "discord.js";
import { SeasonRepo } from "@/modules/schedule/season.repo";

@Injectable()
export class BattleService {
	private static readonly logger = new Logger(BattleService.name);

	constructor(
		private sectionRepo: SeasonRepo,
		private readonly client: Client,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { utcOffset: 0 })
	async updateBulletin() {
		const battleRating = await this.sectionRepo.getCurrentBattleRating();
		console.log(battleRating);
		const messages = { category: "聯隊戰", announcement: "今日分房：新賽季" };
		if (battleRating) {
			const brString = battleRating.toFixed(1).replace(/\d/g, digitToFullwidth);
			messages.announcement = `今日分房：${brString}`;
			messages.category = `聯隊戰：${brString}`;
		}
		const category = this.client.channels.resolve("1046624503276515339");
		if (category && category.type === ChannelType.GuildCategory) {
			category.setName(messages.category);
		}

		const channel = this.client.channels.resolve("1047751571708051486");
		if (channel && channel.type === ChannelType.GuildVoice) {
			channel.setName(messages.announcement);
		}

		BattleService.logger.log("更新聯隊戰分房");

		return battleRating !== undefined;
	}
}

const digitFullwidthMap = {
	"0": "０",
	"1": "１",
	"2": "２",
	"3": "３",
	"4": "４",
	"5": "５",
	"6": "６",
	"7": "７",
	"8": "８",
	"9": "９",
};

function digitToFullwidth(digit: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9") {
	return digitFullwidthMap[digit];
}
