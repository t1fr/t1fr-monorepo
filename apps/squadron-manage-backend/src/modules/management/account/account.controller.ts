import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AccountService } from "./account.service";
import { JwtGuard, OfficerGuard } from "../../../guards";
import { AccountListData, AccountUpdateData } from "./account.schema";

@Controller("accounts")
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

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

