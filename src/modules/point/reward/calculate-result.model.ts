import { AccountSeasonResult } from "@/modules/point/reward/account-season-result.model";

export interface CalculateResult extends AccountSeasonResult {
	point: number;
	backup: number;
	reasons: string[];
}
