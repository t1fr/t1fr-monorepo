import { Controller, Get } from "@nestjs/common";
import { AccountRepo } from "@/modules/management/account/account.repo";

@Controller()
export class AccountController {
	constructor(private readonly accountRepo: AccountRepo) {}

	@Get("accounts")
	async getAccounts() {
		return await this.accountRepo.listAllExistAccounts();
	}
}

