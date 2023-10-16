import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AccountService } from "@/modules/management/account/account.service";
import { AccountListData, AccountUpdateData } from "@/modules/management/account/account.schema";
import { ApiResponse } from "@nestjs/swagger";
import { JwtGuard, OfficerGuard } from "@/guards";

@Controller("accounts")
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get("test")
	async test() {
		await this.accountService.backup();
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

