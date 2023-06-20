import { AccountType } from "@/modules/squadron/account/account-type.enum";

export interface AccountSeasonResult {
	id: string;
	accountType: AccountType;
	personalRating: number;
	memberId: string;
}
