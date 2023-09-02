import { Injectable, Logger } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/calculate.stage.interface";
import { CalculateResult } from "@/modules/management/point/calculate-result.model";
import { AccountType } from "@/modules/management/account/account.schema";

@Injectable()
export class AccountTypeStage implements CalculateStage {
	private static readonly logger = new Logger(AccountTypeStage.name);

	calculate(results: CalculateResult[]): CalculateResult[] {
		AccountTypeStage.logger.log("根據帳號類型計算中");
		const lookupTable = new Map<string, number>();
		for (const result of results) {
			if (result.point === 0) continue;
			const localReason = [];
			switch (result.type) {
				case AccountType.SPONSOR:
				case AccountType.MAIN_CASUAL:
				case AccountType.ALT_PUBLIC:
					result.point *= 0;
					localReason.push(`因為帳號為 ${result.type}`, "無法獲得積分");
					break;
				case AccountType.ALT_PRIVATE:
					const factor = lookupTable.get(result.owner) ?? 2;
					lookupTable.set(result.owner, factor + 1);
					result.point = Math.floor(result.point / factor);
					localReason.push(`因為帳號為 ${result.type}`, `積分需除以 ${factor}`, `變為 ${result.point} 積分`);
					break;
				case AccountType.MAIN_PUBLIC:
					result.point = Math.floor(result.point / 3);
					localReason.push(`因為帳號為 ${result.type}`, "積分需除以 3", `變為 ${result.point} 積分`);
					break;
			}
			if (localReason.length) result.reasons.push(localReason.join("，"));
		}
		AccountTypeStage.logger.log("根據帳號類型計算完畢");
		return results;
	}
}
