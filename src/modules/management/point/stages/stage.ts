import { RatingStage } from "@/modules/management/point/stages/rating.stage";
import { AccountTypeStage } from "@/modules/management/point/stages/account-type.stage";
import { BudgetStage } from "@/modules/management/point/stages/budget.stage";
import { RewardCalculateData } from '@/modules/management/point/subservice/result.data'

export interface CalculateStage {
	calculate(results: RewardCalculateData[]): RewardCalculateData[];
}

export const stages = [RatingStage, AccountTypeStage, BudgetStage];
