import { Inject, Injectable } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/stage";
import { Summary } from "@/modules/management/member/summary.schema";

export class CalculateData implements Summary {
	_id: string;
	nickname: string;
	accounts: { _id: string; activity: number; personalRating: number; type: string; available: number; reasons: string[] }[];
	points: { _id: string; sum: number; logs: { category: string; date: string; delta: number; detail: string }[] }[];
}

@Injectable()
export class RewardService {
	constructor(@Inject("stages") private readonly stages: CalculateStage[]) {}

	async calculate(summaries: Summary[]): Promise<CalculateData[]> {
		const rewardPointData: CalculateData[] = summaries.map(summary => {
			const { accounts, points, ...other } = summary;
			return {
				accounts: accounts.map(account => ({ ...account, available: 0, reasons: [] })),
				points: points.map(point => ({ _id: point._id, sum: point.sum, logs: [] })),
				...other,
			};
		});
		return this.stages.reduce((acc, val) => val.calculate(acc), rewardPointData);
	}
}
