import { AccountSeasonResult, PointCalculateStage } from './reward-point.service';
import { AccountType, getAccountTypeEnglishName } from '../enum/AccountType';

class AccountTypeStage implements PointCalculateStage {
  calculate(results: AccountSeasonResult[]): AccountSeasonResult[] {
    const lookupTable = new Map<string, number>();
    results.forEach(result => {
      switch (result.accountType) {
        case AccountType.SPONSOR:
        case AccountType.MAIN_CASUAL:
        case AccountType.ALT_PUBLIC:
          result.point *= 0;
          result.reasons.push(`cos ${getAccountTypeEnglishName(result.accountType)} ➔*0 ${result.point}`);
          break;
        case AccountType.ALT_PRIVATE:
          let factor = 2;
          if (lookupTable.has(result.memberId)) {
            factor += lookupTable.get(result.memberId)!!;
            lookupTable.set(result.memberId, factor - 1);
          } else {
            lookupTable.set(result.memberId, 1);
          }
          result.point = Math.floor(result.point / factor);
          result.reasons.push(`Cos  ${getAccountTypeEnglishName(result.accountType)} ➔/${factor} ${result.point}`);
          break;
        case AccountType.MAIN_PUBLIC:
          result.point = Math.floor(result.point / 3);
          result.reasons.push(`cos ${getAccountTypeEnglishName(result.accountType)} ➔/3 ${result.point}`);
          break;
      }
    });
    return results;
  }
}

export const accountTypeStage = new AccountTypeStage();