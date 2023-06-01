import { AccountType, getAccountTypeName } from "@/modules/squadron/account/account-type.enum";
import { Injectable } from "@nestjs/common";
import { CalculateStage } from "@/modules/point/reward/stages/calculate.stage.interface";
import { CalculateResult } from "@/modules/point/reward/calculate-result.model";
import { StageCallback } from "@/modules/point/reward/reward.service";

@Injectable()
export class AccountTypeStage implements CalculateStage {
	calculate(results: CalculateResult[], callback: StageCallback): CalculateResult[] {
		callback("根據帳號類型計算中");
		const lookupTable = new Map<string, number>();
		for (const result of results) {
			if (result.point === 0) continue;
			const accountTypeName = getAccountTypeName(result.accountType);
			const localReason = [];
			switch (result.accountType) {
				case AccountType.SPONSOR:
				case AccountType.MAIN_CASUAL:
				case AccountType.ALT_PUBLIC:
					result.point *= 0;
					localReason.push(`因為帳號為 ${accountTypeName}`, "無法獲得積分");
					break;
				case AccountType.ALT_PRIVATE:
					const factor = lookupTable.get(result.memberId) ?? 2;
					lookupTable.set(result.memberId, factor + 1);
					result.point = Math.floor(result.point / factor);
					localReason.push(`因為帳號為 ${accountTypeName}`, `積分需除以 ${factor}`, `變為 ${result.point} 積分`);
					break;
				case AccountType.MAIN_PUBLIC:
					result.point = Math.floor(result.point / 3);
					localReason.push(`因為帳號為 ${accountTypeName}`, "積分需除以 3", `變為 ${result.point} 積分`);
					break;
			}

			result.reasons.push(localReason.join("，"));
		}

		callback("根據帳號類型計算完畢");
		return results;
	}
}
