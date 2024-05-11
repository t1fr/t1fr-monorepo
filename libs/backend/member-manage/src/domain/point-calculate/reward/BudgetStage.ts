import { Injectable } from "@nestjs/common";
import { groupBy, sumBy } from "lodash-es";
import type { RewardCalculateStage, StageData } from "./stage";

@Injectable()
export class BudgetStage implements RewardCalculateStage {
	private readonly budget = 250;

	calculate(results: StageData[]): StageData[] {

		let totalPoints = sumBy(results, it => it.point);
		if (this.budget >= totalPoints) return results;

		const groups = groupBy(results, result => result.point);

		// 非最優算法
		while (this.budget < totalPoints) {
			results.forEach(result => {
				if (result.point === 0) return;
				result.point--;
				totalPoints--;
			});
		}

		for (const point of Object.keys(groups).sort((a, b) => parseInt(b) - parseInt(a))) {
			// 該組別最多可以回填至多少分
			const maxPoint = parseInt(point);
			// 該組別幾位
			const recordCount = groups[maxPoint].length;
			// 剩多少積分可以分配
			const remainingBudget = this.budget - totalPoints;
			const quotient = (remainingBudget / recordCount) >> 0;
			const increment = Math.min(quotient, maxPoint - groups[maxPoint][0].point);
			if (increment === 0) break;
			totalPoints += increment * recordCount;
			groups[maxPoint].forEach(result => {
				result.point += increment;
				result.reason.push("因預算限制調整");
			});
		}
		return Object.values(groups).reduce((acc, val) => acc.concat(val));
	}
}
