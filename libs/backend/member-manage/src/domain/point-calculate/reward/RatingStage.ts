import { Injectable } from "@nestjs/common";
import type { RewardCalculateStage, StageData } from "./stage";

@Injectable()
export class RatingStage implements RewardCalculateStage {
	private readonly thresholds = [
		{ rating: 1666, point: 20 },
		{ rating: 1400, point: 10 },
		{ rating: 1100, point: 6 },
		{ rating: 800, point: 3 },
		{ rating: 500, point: 1 },
	];

	calculate(data: StageData[]): StageData[] {
		data = data.filter(value => value.personalRating >= 500);

		// 非最優算法，但足夠簡單去維護
		data.forEach(value => {
			const nearestIndex = this.thresholds.findIndex(t => value.personalRating >= t.rating);
			// 因前面已過濾掉沒有滿足條件的帳號，可放心認為 nearestIndex > -1
			const { point, rating } = this.thresholds[nearestIndex];
			value.point = point;
			if (nearestIndex === 0) value.reason.push(`個人評分 ≥ ${rating}`);
			else value.reason.push(`${this.thresholds[nearestIndex - 1].rating} > 個人評分 ≥ ${rating}`);
		});
		return data;
	}
}
