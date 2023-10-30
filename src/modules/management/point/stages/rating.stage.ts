import { Injectable, Logger } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/stage";
import { CalculateData } from "@/modules/management/point/reward.service";

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

	calculate(data: CalculateData[]): CalculateData[] {
		RatingStage.logger.log("根據賽季評分計算中");
		for (let i = 0; i < data.length; i++) {
			const accounts = data[i].accounts;
			for (const account of accounts) {
				const matched = this.thresholds.find(threshold => threshold.rating < account.personalRating);
				if (!matched) continue;
				account.available = matched.point;
			}
		}
		RatingStage.logger.log("根據賽季評分計算完畢");
		return data;
	}
}
