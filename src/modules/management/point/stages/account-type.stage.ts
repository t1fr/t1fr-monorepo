import { Injectable, Logger } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/stage";
import { AccountType } from "@/modules/management/account/account.schema";
import { CalculateData } from "@/modules/management/point/reward.service";

@Injectable()
export class AccountTypeStage implements CalculateStage {
	private static readonly logger = new Logger(AccountTypeStage.name);

	calculate(data: CalculateData[]): CalculateData[] {
		AccountTypeStage.logger.log("根據帳號類型計算中");
		const lookupTable = new Map<string, number>();
		const noGainTypes: AccountType[] = ["🇳 休閒主帳", "🇽 贊助者", "🇧 公用小帳", "🇩 半公用主帳"];
		return data;
		// for (const index in data) {
		// 	const accounts = data[index].accounts;
		// 	for(const account of accounts){
		// 		switch (account.type) {
		// 			case "🇸 聯隊戰主帳":
		// 				continue;
		// 			case "🇦 個人小帳":
		// 				const factor = lookupTable.get(account.owner) ?? 2;
		// 				lookupTable.set(account.owner, factor + 1);
		// 				account.currentPoints = Math.floor(account.currentPoints / factor);
		// 				account.reasons.push(`**${account.type}** 除 ${factor}`);
		// 				break;
		// 			case "🇨 公用主帳":
		// 				account.currentPoints = Math.floor(account.currentPoints / 3);
		// 				account.reasons.push(`**${account.type}** 除 3`);
		// 				break;
		// 		}
		// 	}
		// }
		// AccountTypeStage.logger.log("根據帳號類型計算完畢");
		// return awardableAccounts;
	}
}
