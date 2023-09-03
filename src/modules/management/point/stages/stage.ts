import { CalculateResult } from "@/modules/management/point/calculate-result.model";
import { RatingStage } from "@/modules/management/point/stages/rating.stage";
import { AccountTypeStage } from "@/modules/management/point/stages/account-type.stage";
import { BudgetStage } from "@/modules/management/point/stages/budget.stage";

export interface CalculateStage {
	calculate(results: CalculateResult[]): CalculateResult[];
}

export const stages = [RatingStage, AccountTypeStage, BudgetStage];
