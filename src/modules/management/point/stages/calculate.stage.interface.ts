import { CalculateResult } from "@/modules/management/point/calculate-result.model";

export interface CalculateStage {
	calculate(results: CalculateResult[]): CalculateResult[];
}
