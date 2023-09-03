import { Injectable, Logger } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/stage";
import { CalculateResult } from '@/modules/management/point/reward.service';

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
		results.sort((a, b) => b.personalRating - a.personalRating);
		let index = 0;
		for (let i = 0; i < results.length; i++) {
			const result = results[i];
			while (index < this.thresholds.length && this.thresholds[index].rating > result.personalRating) index++;
			if (index === this.thresholds.length) {
				result.reasons.push(`本季個人評分為 ${result.personalRating}，無法獲得積分`);
			} else {
				const { rating, point } = this.thresholds[index];
				result.point = point;
				result.reasons.push(`本季個人評分為 ${result.personalRating}，大於門檻 ${rating}，因此獲得 ${point} 積分`);
			}
		}
		RatingStage.logger.log("根據賽季評分計算完畢");
		return results;
	}
}
