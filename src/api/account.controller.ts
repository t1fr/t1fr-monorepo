import { Controller, Get, Res } from '@nestjs/common';
import { AccountRepo } from '../repository/account.repo';
import { AccountType, getAccountTypeChineseName } from '../enum/AccountType';
import { Response } from 'express';
import { HttpStatusCode } from 'axios';

@Controller()
export class AccountController {
  constructor(private readonly accountRepo: AccountRepo) {}

  @Get('/accounts')
  async getAccounts(@Res() response: Response) {
    const accounts = await this.accountRepo.accounts({
      id: true,
      accountType: true,
      owner: {
        select: { discordId: true },
      },
      personalRating: true,
      activity: true,
      joinDate: true,
    });

    const responseItem = accounts.map(account =>
      new AccountApiResponseItem(
        account.id!!,
        account.accountType!!,
        account.owner?.discordId ?? '未知',
        account.personalRating!!,
        account.activity!!,
        account.joinDate!!,
      ));

    response.status(HttpStatusCode.Ok).json(responseItem);
  }
}

class AccountApiResponseItem {
  private readonly accountTypeName: string;

  constructor(
    private readonly inGameId: string,
    accountType: AccountType,
    private readonly discordId: string,
    private readonly personalRating: number,
    private readonly activity: number,
    private readonly joinData: Date,
  ) {
    this.accountTypeName = getAccountTypeChineseName(accountType);
  }
}