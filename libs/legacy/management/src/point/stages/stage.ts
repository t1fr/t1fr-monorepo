import { BudgetStage } from "./budget.stage";
import { AccountTypeStage } from "./account-type.stage";
import { RewardCalculateData } from "../subservice/result.data";
import { RatingStage } from "./rating.stage";

export interface CalculateStage {
	calculate(results: RewardCalculateData[]): RewardCalculateData[];
}

export const stages = [RatingStage, AccountTypeStage, BudgetStage];
