import { Controller, Get, Res } from "@nestjs/common";
import { AccountRepo } from "@/modules/squadron/account/account.repo";
import { AccountType, getAccountTypeName } from "@/modules/squadron/account/account-type.enum";
import { Response } from "express";
import { HttpStatusCode } from "axios";

@Controller()
export class AccountController {
	constructor(private readonly accountRepo: AccountRepo) {}

	@Get("accounts")
	async getAccounts(@Res() response: Response) {
		const accounts = await this.accountRepo.accounts({
			id: true,
			accountType: true,
			owner: {
				select: {
					discordId: true,
					nickname: true,
				},
			},
			personalRating: true,
			activity: true,
			joinDate: true,
		});

		const responseItem = accounts.map(
			(account) =>
				new AccountApiResponseItem(
					account.id!,
					account.accountType!,
					account.owner?.discordId ?? "未知",
					account.owner?.nickname ?? "未知",
					account.personalRating!,
					account.activity!,
					account.joinDate!,
				),
		);

		response.status(HttpStatusCode.Ok).json(responseItem);
	}
}

class AccountApiResponseItem {
	private readonly accountTypeName: string;
	private readonly accountTypeCode: string;

	constructor(
		private readonly inGameId: string,
		accountType: AccountType,
		private readonly discordId: string,
		private readonly discordNickname: string,
		private readonly personalRating: number,
		private readonly activity: number,
		private readonly joinDate: Date,
	) {
		const [emoji, name] = getAccountTypeName(accountType).split(" ");
		this.accountTypeName = name;
		this.accountTypeCode = emoji.replace(":regional_indicator_", "").replace(":", "");
	}
}
