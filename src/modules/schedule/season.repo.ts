import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Season, Section } from "@/modules/schedule/season.schema";
import { Model } from "mongoose";
import dayjs from "dayjs";

@Injectable()
export class SeasonRepo {
	constructor(@InjectModel(Season.name) private readonly seasonModel: Model<Season>) {}

	public async upsert(sections: Section[]) {
		sections.sort((a, b) => dayjs(a.from).diff(b.from));
		return this.seasonModel.findOneAndUpdate(
			{
				year: sections[0].from.getFullYear(),
				season: sections[0].from.getMonth() / 2 + 1,
			},
			{ sections: sections },
			{ upsert: true },
		);
	}

	async getCurrentBattleRating(): Promise<number> {
		const now = new Date();
		const year = now.getUTCFullYear();
		const season = now.getUTCMonth() / 2 + 1;
		return (
			await this.seasonModel.aggregate<{ battleRating: number }>([
				{ $match: { year, season } },
				{ $unwind: "$sections" },
				{ $match: { "sections.from": { $lte: now }, "sections.to": { $gte: now } } },
				{ $project: { _id: 0, battleRating: "$sections.battleRating" } },
			])
		)[0].battleRating;
	}
}
