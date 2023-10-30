import { RatingStage } from "@/modules/management/point/stages/rating.stage";
import { AccountTypeStage } from "@/modules/management/point/stages/account-type.stage";
import { BudgetStage } from "@/modules/management/point/stages/budget.stage";
import { CalculateData } from "@/modules/management/point/reward.service";

export interface CalculateStage {
	calculate(results: CalculateData[]): CalculateData[];
}

export const stages = [RatingStage, AccountTypeStage, BudgetStage];
