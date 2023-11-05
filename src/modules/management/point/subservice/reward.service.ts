import { Inject, Injectable } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/stage";
import { Summary } from "@/modules/management/point/summary.schema";
import { AccountSnapshot } from "@/modules/management/point/account.snapshot.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Error, Model } from "mongoose";
import { ConnectionName } from "@/constant";
import { BaseResultData, RewardCalculateData } from "@/modules/management/point/subservice/result.data";
import { PointSubservice } from "@/modules/management/point/subservice/service.interface";
import { groupBy } from "lodash";

@Injectable()
export class RewardService implements PointSubservice {
	constructor(@Inject("stages") private readonly stages: CalculateStage[]) {}

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
		for (let groupByRatingKey of Object.keys(groupByRating).sort((a, b) => parseInt(b) - parseInt(a))) {
			content.push(`## 獲得積分：${groupByRatingKey}`);
			groupByRating[groupByRatingKey].forEach(account => content.push(`> <@${account.owner}>：${account.reason.join("丨")}`));
		}

		const total = data.reduce((acc, cur) => acc + cur.point, 0);

		content.push(`**本賽季結算發放總量：${total}**`);

		return content;
	}
}
