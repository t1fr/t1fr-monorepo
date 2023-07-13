import { CalculateResult } from "@/modules/point/reward/calculate-result.model";

export interface CalculateStage {
	calculate(results: CalculateResult[]): CalculateResult[];
}
