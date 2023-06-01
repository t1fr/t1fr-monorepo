import { CalculateResult } from "@/modules/point/reward/calculate-result.model";
import { StageCallback } from "@/modules/point/reward/reward.service";

export interface CalculateStage {
	calculate(results: CalculateResult[], callback: StageCallback): CalculateResult[];
}
