import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { AccountService } from "@/modules/management/account/account.service";
import { AccountUpdateData } from "@/modules/management/account/account.schema";

@Controller("accounts")
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get()
	async getAccounts() {
		return await this.accountService.findExistingAccount();
	}

	@Patch(":id")
	async updateAccount(@Param("id") id: string, @Body() data: AccountUpdateData) {
		const { type, ownerId } = data;
		this.accountService.updateAccount(id, { type, ownerId });
	}
}

