import {Body, Controller, Get, Param, Patch, UseGuards} from "@nestjs/common";
import {ApiResponse} from "@nestjs/swagger";
import {AccountListData, AccountUpdateData, AccountService} from "@t1fr/legacy/management";
import {JwtGuard, OfficerGuard} from "./guards";

@Controller("accounts")
export class AccountController {
  constructor(private readonly accountService: AccountService) {
  }

  @Get()
  @UseGuards(JwtGuard, OfficerGuard)
  @ApiResponse({ description: "聯隊內的帳號資訊，延遲最長 4 小時", type: AccountListData, isArray: true })
  async getAccounts() {
    return await this.accountService.findExistingAccount();
  }

  @Patch(":id")
  @UseGuards(JwtGuard, OfficerGuard)
  async updateAccount(@Param("id") id: string, @Body() data: AccountUpdateData) {
    const { type, owner } = data;
    this.accountService.updateAccount(id, { type, owner });
  }
}

