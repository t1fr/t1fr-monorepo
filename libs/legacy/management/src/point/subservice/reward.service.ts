import { Inject, Injectable } from "@nestjs/common";
import { groupBy } from "lodash-es";
import { Model } from "mongoose";
import { AccountSnapshot } from "../account.snapshot.schema";
import { CalculateStage } from "../stages/stage";
import { Summary } from "../summary.schema";
import { BaseResultData, RewardCalculateData } from "./result.data";
import { PointSubservice } from "./service.interface";

@Injectable()
export class RewardService implements PointSubservice {
	constructor(@Inject("stages") private readonly stages: CalculateStage[]) {
	}

	async calculate(snapshotModel: Model<AccountSnapshot>, summaries: Summary[]): Promise<RewardCalculateData[]> {
		const overLimit = summaries.filter(summary => summary.points.獎勵.sum >= 70).map(value => value._id);
		const data = await snapshotModel.aggregate<RewardCalculateData>([
			{ $match: { owner: { $nin: overLimit } } },
			{ $sort: { personalRating: -1 } },
			{ $set: { point: 0, reason: [] } },
			{ $unset: ["joinDate", "activity"] },
		]);
		return this.stages.reduce((acc, val) => val.calculate(acc), data);
	}

	toPost(data: BaseResultData[]): string[] {
		const groupByRating = groupBy(data, it => it.point);
		const content: string[] = [];
		for (const groupByRatingKey of Object.keys(groupByRating).sort((a, b) => parseInt(b) - parseInt(a))) {
			content.push(`## 獲得積分：${groupByRatingKey}`);
			groupByRating[groupByRatingKey].forEach(account => content.push(`> <@${account.owner}>：${account.reason.join("丨")}`));
		}

		const total = data.reduce((acc, cur) => acc + cur.point, 0);

		content.push(`**本賽季結算發放總量：${total}**`);

		return content;
	}
}
