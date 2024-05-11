import { Injectable } from "@nestjs/common";
import { AccountType, AccountTypeNameMap } from "../../model";
import type { RewardCalculateStage, StageData } from "./stage";

@Injectable()
export class AccountTypeStage implements RewardCalculateStage {

    calculate(data: StageData[]): StageData[] {
        const lookupTable = new Map<string, number>();
        const noGainTypes: AccountType[] = [AccountType.N_RelaxMain, AccountType.D_SemipublicMain];
        data = data.filter(value => !noGainTypes.includes(value.type));
        data.forEach(account => {
            const factor = lookupTable.get(account.ownerId) ?? 2;
            const accountTypeName = AccountTypeNameMap[account.type]
            switch (account.type) {
                case AccountType.A_PrivateAlt:
                case AccountType.B_PublicAlt:
                    lookupTable.set(account.ownerId, factor + 1);
                    account.point = Math.floor(account.point / factor);
                    account.reason.push(`${accountTypeName} 除 ${factor}`);
                    break;
                case AccountType.C_PublicMain:
                    account.point = Math.floor(account.point / 3);
                    account.reason.push(`${accountTypeName} 除 3`);
                    break;
            }
        });
        return data;
    }
}
