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

	public getCurrentSection(): Section {
		const now = new Date();
		return { from: now, to: now, battleRating: 8.0 };
		// return this.seasonModel.findOne({ sections: { from: { $gte: now } } });
	}
}
