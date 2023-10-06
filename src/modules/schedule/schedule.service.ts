import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ChannelType, Client } from "discord.js";
import { InjectModel } from "@nestjs/mongoose";
import { Season, Section } from "@/modules/schedule/season.schema";
import { ConnectionName } from "@/constant";
import { Model } from "mongoose";
import dayjs from "dayjs";

@Injectable()
export class ScheduleService {
	private static readonly logger = new Logger(ScheduleService.name);

	constructor(
		@InjectModel(Season.name, ConnectionName.Management) private readonly seasonModel: Model<Season>,
		private readonly client: Client,
	) {}

	async upsertSeason(year: string, raw: string) {
		const sections = ScheduleService.parseTextToSections(parseInt(year), raw);
		sections.sort((a, b) => dayjs(a.from).diff(b.from));
		await this.seasonModel.findOneAndUpdate(
			{ year: sections[0].from.getFullYear(), season: sections[0].from.getMonth() / 2 + 1 },
			{ sections: sections },
			{ upsert: true },
		);
	}

	async getCurrentBattleRating() {
		return new Promise<number | null>(async (resolve, reject) => {
			const now = new Date();
			const year = now.getUTCFullYear();
			const season = Math.floor(now.getUTCMonth() / 2) + 1;
			const sections = await this.seasonModel.aggregate<{ battleRating: number }>([
				{ $match: { year, season } },
				{ $unwind: "$sections" },
				{ $match: { "sections.from": { $lte: now }, "sections.to": { $gt: now } } },
				{ $project: { _id: 0, battleRating: "$sections.battleRating" } },
			]);

			if (sections.length) resolve(sections[0].battleRating);
			resolve(null);
		});
	}

	async getCurrentSeasonTable() {
		const now = new Date();
		const year = now.getUTCFullYear();
		const season = Math.floor(now.getUTCMonth() / 2) + 1;
		const found = await this.seasonModel.findOne({ year, season });

		if (!found) return Promise.reject("查無當前賽季資料");

		return ScheduleService.seasonToTable(found);
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { utcOffset: 0 })
	async updateBulletin() {
		const battleRating = await this.getCurrentBattleRating();
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

		ScheduleService.logger.log("更新聯隊戰分房");

		return battleRating !== undefined;
	}

	private static seasonToTable(currentSeason: Season) {
		const { year, season, sections } = currentSeason;
		const startMonth = (season - 1) * 2 + 1;
		const scheduleMessage = [
			`**${year} 年 ${startMonth} ~ ${startMonth + 1} 月**聯隊戰行程`,
			"```",
			"╭───────┬───────┬──────────╮",
			"│ Start │  End  │  Max BR  │",
			"├───────┼───────┼──────────┤",
		];

		const sectionRows = sections.map(section => {
			const startString = dayjs(section.from).format("MM/DD");
			const endString = dayjs(section.to).subtract(1, "day").format("MM/DD");
			const battleRatingString = section.battleRating.toFixed(1).padStart(6);
			return `│ ${startString} │ ${endString} │  ${battleRatingString}  │`;
		});

		sectionRows.forEach(sectionRow => {
			scheduleMessage.push(sectionRow, "├───────┼───────┼──────────┤");
		});

		scheduleMessage[scheduleMessage.length - 1] = "╰───────┴───────┴──────────╯";
		scheduleMessage.push("```");

		return scheduleMessage.join("\n");
	}

	static parseTextToSections(year: number, scheduleText: string): Section[] {
		return scheduleText
			.split("\n")
			.map(line => line.match(/(\d*\.\d*)\s*\((\d*\.\d*).*?(\d*\.\d*)\)/))
			.map(matches => {
				if (!matches) throw new Error("提供的賽季論壇訊息不合格式");
				return {
					from: dayjs.utc(`${year}.${matches[2]}`, "YYYY.DD.MM").toDate(),
					to: dayjs.utc(`${year}.${matches[3]}`, "YYYY.DD.MM").add(1, "day").toDate(),
					battleRating: parseFloat(matches[1]),
				};
			});
	}
}

const digitFullwidthMap = { "0": "０", "1": "１", "2": "２", "3": "３", "4": "４", "5": "５", "6": "６", "7": "７", "8": "８", "9": "９" };

function digitToFullwidth (digit: keyof typeof digitFullwidthMap) {
  return digitFullwidthMap[digit]
}
