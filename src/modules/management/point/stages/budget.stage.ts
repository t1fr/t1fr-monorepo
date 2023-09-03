import { Injectable, Logger } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/stage";
import { CalculateResult } from "@/modules/management/point/calculate-result.model";
import { groupBy } from "lodash";

@Injectable()
export class BudgetStage implements CalculateStage {
	private static readonly logger = new Logger(BudgetStage.name);
	private readonly budget = 250;

	calculate(results: CalculateResult[]): CalculateResult[] {
		BudgetStage.logger.log("根據預算計算中");

		let totalPoints = results.reduce((acc, val) => acc + val.point, 0);
		if (this.budget >= totalPoints) return results;

		const groups = groupBy(results, (result) => result.point);
		do {
			for (const point in groups) {
				groups[point].forEach((result) => {
					if (result.point !== 0) {
						result.point--;
						totalPoints--;
					}
				});
			}
		} while (this.budget < totalPoints);
		for (const point of Object.keys(groups).sort((a, b) => parseInt(b) - parseInt(a))) {
			// 該組別最多可以回填至多少分
			const maxPoint = parseInt(point);
			// 該組別幾位
			const recordCount = groups[maxPoint].length;
			// 剩多少積分可以分配
			const remainingBudget = this.budget - totalPoints;
			const quotient = (remainingBudget / recordCount) >> 0;
			const incretment = Math.min(quotient, maxPoint - groups[maxPoint][0].point);
			if (incretment === 0) break;
			totalPoints += incretment * recordCount;
			groups[maxPoint].forEach((result) => {
				result.point += incretment;
			});
		}
		BudgetStage.logger.log("根據預算計算完畢");
		return Object.values(groups).reduce((acc, val) => acc.concat(val));
	}
}
