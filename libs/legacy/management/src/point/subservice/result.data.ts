import { AccountSnapshot } from "../account.snapshot.schema";
import { AccountType } from "../../account";

export class BaseResultData {
	_id!: string;
	owner!: string | null;
	point!: number;
	reason!: string[];
}

export class RewardCalculateData extends BaseResultData implements Partial<AccountSnapshot> {
	personalRating!: number;
	type!: AccountType | null;
}

export class AbsenceCalculateData extends BaseResultData implements Partial<AccountSnapshot> {
	personalRating!: number;
	group!: string;
	currentPoint!: number;
	previewPoint!: number;
	joinDate!: string;
	isExist!: boolean;
}
