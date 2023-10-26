import { Injectable, Logger } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/stage";
import { CalculateResult } from "@/modules/management/point/reward.service";

@Injectable()
export class RatingStage implements CalculateStage {
	private static readonly logger = new Logger(RatingStage.name);
	private readonly thresholds = [
		{ rating: 1700, point: 20 },
		{ rating: 1690, point: 15 },
		{ rating: 1400, point: 10 },
		{ rating: 1395, point: 8 },
		{ rating: 1100, point: 6 },
		{ rating: 800, point: 3 },
		{ rating: 500, point: 1 },
	];

	calculate(results: CalculateResult[]): CalculateResult[] {
		RatingStage.logger.log("根據賽季評分計算中");
		const awardableAccounts = results.filter((result) => result.personalRating >= this.thresholds[this.thresholds.length - 1].rating);
		awardableAccounts.sort((a, b) => b.personalRating - a.personalRating);
		let index = 0;
		for (let i = 0; i < awardableAccounts.length; i++) {
			const account = awardableAccounts[i];
			while (this.thresholds[index].rating > account.personalRating) index++;
			const { rating, point } = this.thresholds[index];
			account.point = point;
			account.reasons.push(`${rating} ≤ 個人評分${index > 0 ? ` < ${this.thresholds[index - 1].rating}` : ""}`);
		}
		RatingStage.logger.log("根據賽季評分計算完畢");
		return awardableAccounts;
	}
}
