import type { AccountType } from "../../model";

export interface RewardCalculateStage {
	calculate(results: StageData[]): StageData[];
}

export interface StageData {
	id: string;
	ownerId: string;
	point: number;
	reason: string[];
	personalRating: number;
	type: AccountType;
}

