import { Injectable } from '@nestjs/common';
import { AccountRepo } from '../repository/account.repo';
import { AccountType } from '../enum/AccountType';
import { budgetStage } from './budget.stage';
import { ratingStage } from './rating.stage';
import { accountTypeStage } from './account-type.stage';

@Injectable()
export class RewardPointService {

  private readonly stages: PointCalculateStage[] = [ratingStage, accountTypeStage, budgetStage];

  constructor(private accountRepo: AccountRepo) {}

  public async calculate() {
    const accounts = await this.accountRepo.accounts({ id: true, accountType: true, personalRating: true, memberId: true, num: true });
    const accountWithPoint: AccountSeasonResult[] = accounts.map(account => ({
      id: account.id!!,
      accountType: account.accountType!!,
      personalRating: account.personalRating!!,
      memberId: account.memberId!!,
      num: account.num!!,
      point: 0,
      backup: 0,
      reasons: [],
    }));

    return this.stages.reduce((acc, val) => val.calculate(acc), accountWithPoint);
  }
}

export interface AccountSeasonResult {
  id: string,
  accountType: AccountType,
  personalRating: number,
  memberId: string,
  num: number
  point: number
  reasons: string[]
}

export interface PointCalculateStage {
  calculate(results: AccountSeasonResult[]): AccountSeasonResult[];
}