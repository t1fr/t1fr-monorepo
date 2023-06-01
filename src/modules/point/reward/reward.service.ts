import { Inject, Injectable } from "@nestjs/common";
import { CalculateStage } from "@/modules/point/reward/stages/calculate.stage.interface";
import { AccountSeasonResult } from "@/modules/point/reward/account-season-result.model";
import { CalculateResult } from "@/modules/point/reward/calculate-result.model";

@Injectable()
export class RewardService {
	constructor(@Inject("stages") private readonly stages: CalculateStage[]) {}

	public calculate(seasonResult: AccountSeasonResult[], callback: StageCallback): CalculateResult[] {
		const rewardPointData: CalculateResult[] = seasonResult.map((account) => ({
			...account,
			point: 0,
			backup: 0,
			reasons: [],
		}));

		return this.stages.reduce((acc, val) => val.calculate(acc, callback), rewardPointData);
	}
}

export type StageCallback = (message: string) => Promise<void>;
