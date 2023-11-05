import { Injectable, Logger } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/stage";
import { AccountType } from "@/modules/management/account/account.schema";
import { RewardCalculateData } from '@/modules/management/point/subservice/result.data'

@Injectable()
export class AccountTypeStage implements CalculateStage {
	private static readonly logger = new Logger(AccountTypeStage.name);

	calculate(data: RewardCalculateData[]): RewardCalculateData[] {
		AccountTypeStage.logger.log("根據帳號類型計算中");
		const lookupTable = new Map<string, number>();
		const noGainTypes: AccountType[] = ["🇳 休閒主帳", "🇽 贊助者", "🇧 公用小帳", "🇩 半公用主帳"];
		data = data.filter(value => !noGainTypes.includes(value.type!));
		data.forEach(account => {
			switch (account.type) {
				case "🇦 個人小帳":
					const factor = lookupTable.get(account.owner!) ?? 2;
					lookupTable.set(account.owner!, factor + 1);
					account.point = Math.floor(account.point / factor);
					account.reason.push(`**${account.type}** 除 ${factor}`);
					break;
				case "🇨 公用主帳":
					account.point = Math.floor(account.point / 3);
					account.reason.push(`**${account.type}** 除 3`);
					break;
			}
		});
		AccountTypeStage.logger.log("根據帳號類型計算完畢");
		return data;
	}
}
