import { budgetStage } from "@/modules/point/reward/stages/budget.stage";
import { AccountType } from "@/modules/squadron/account/account-type.enum";
import { AccountSeasonResult } from "@/modules/point/reward/account-season-result.model";

describe("Reward Point", () => {
	const data = [
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 20, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 20, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 10, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 8, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 6, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 6, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 6, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 6, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 6, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 6, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 6, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 6, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 3, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 3, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 1, backup: 0, reasons: [] },
		{ id: "", accountType: AccountType.MAIN_CORE, personalRating: 0, memberId: "", num: 0, point: 1, backup: 0, reasons: [] },
	] as AccountSeasonResult[];
	describe("budget", () => {
		it("", () => {
			const result = budgetStage.calculate(data).map((value) => value.point);
			console.log(result);
			console.log(result.reduce((acc, nxt) => acc + nxt));
			// expect(result).toEqual([0, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 20, 20]);
		});
	});
});
