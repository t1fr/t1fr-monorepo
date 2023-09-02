import { AccountType } from "@/modules/management/account/account.schema";

export interface CalculateResult {
	id: string;
	type: AccountType;
	personalRating: number;
	owner: string;
	point: number;
	backup: number;
	reasons: string[];
}
