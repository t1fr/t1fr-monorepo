import { Injectable, Logger, UseInterceptors } from "@nestjs/common";
import { AccountRepo } from "@/modules/squadron/account/account.repo";
import { Context, createCommandGroupDecorator, Options, SlashCommandContext, Subcommand } from "necord";
import { MessageFlagsBitField } from "discord.js";
import { AccountType, getAccountTypeName } from "@/modules/squadron/account/account-type.enum";
import { MemberType } from "@/modules/squadron/member/member-type.enum";
import { AccountAutocompleteInterceptor } from "@/modules/squadron/account/account.autocomplete";
import { SetOwnershipOption } from "@/modules/squadron/account/set-ownership.option";
import { SetAccountTypeOption } from "@/modules/squadron/account/set-account-type.option";
import { RewardService } from "@/modules/point/reward/reward.service";
import { AccountSeasonResult } from "@/modules/point/reward/account-season-result.model";
import { CalculateResult } from "@/modules/point/reward/calculate-result.model";
import { groupBy } from "lodash";

const AccountCommandGroup = createCommandGroupDecorator({
	name: "account",
	description: "管理聯隊內的 WT 帳號",
});

@Injectable()
@AccountCommandGroup()
export class AccountCommand {
	private readonly logger = new Logger(AccountCommand.name);

	constructor(private readonly accountRepo: AccountRepo, private readonly rewardPointService: RewardService) {}

	@Subcommand({ name: "fetch", description: "從網頁上爬帳號資料" })
	private async onFetch(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply();
		const accounts = await this.accountRepo.fetchFromWeb(async (progressBar) => {
			await interaction.editReply({ content: progressBar });
		});
		if (accounts) {
			await interaction.editReply({ content: `成功更新 ${accounts.length} 位隊員資料` });
		} else {
			await interaction.editReply({ content: "更新失敗" });
		}
	}

	@Subcommand({ name: "set-owner", description: "指定擁有者" })
	@UseInterceptors(AccountAutocompleteInterceptor)
	private async onSetOwner(
		@Context() [interaction]: SlashCommandContext,
		@Options() { accountNum, memberDiscordId }: SetOwnershipOption,
	) {
		const gameAccount = await this.accountRepo.update({ num: accountNum }, { owner: { connect: { discordId: memberDiscordId } } });
		await interaction.reply({
			content: `已成功設置 ID 為 ${gameAccount.id} 的帳號擁有者為 <@${memberDiscordId}>`,
			options: { flags: [MessageFlagsBitField.Flags.SuppressNotifications] },
		});
	}

	@Subcommand({ name: "autolink", description: "自動根據 DC 暱稱後方的 ID 來連結帳號。如果帳號類型未定義，將由連結成員的身分組推斷" })
	private async onAutolink(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply();
		const ownershipData = await this.accountRepo.joinOnId();
		// 只有找得到連結且帳號類型未知的才更新
		const unlinkableId = ownershipData.filter((ownership) => ownership.member_type === null).map((ownership) => ownership.account_id);

		let successCount = 0;

		for (const ownership of ownershipData.filter((ownership) => ownership.member_id !== null)) {
			let accountType = undefined;
			if (ownership.member_type === MemberType.CORE) {
				accountType = AccountType.MAIN_CORE;
			} else if (ownership.member_type === MemberType.CASUAL) {
				accountType = AccountType.MAIN_CASUAL;
			}
			try {
				await this.accountRepo.update(
					{ num: ownership.num },
					{
						owner: { connect: { discordId: ownership.member_id! } },
						accountType: accountType,
					},
				);
				successCount++;
			} catch (e: any) {
				this.logger.error(e);
			}
		}

		this.logger.debug(unlinkableId);

		const content = [
			`可連結 ${ownershipData.length - unlinkableId.length} 個帳號`,
			`成功儲存 ${successCount} 個帳號`,
			`　　失敗 ${ownershipData.length - unlinkableId.length - successCount} 個帳號`,
			"另以下帳號無法建立連結",
			"```",
			...unlinkableId,
			"```",
		].join("\n");
		await interaction.followUp({
			content: content,
		});
	}

	@UseInterceptors(AccountAutocompleteInterceptor)
	@Subcommand({ name: "set-type", description: "設定帳號類型" })
	private async onSetType(@Context() [interaction]: SlashCommandContext, @Options() { accountNum, accountType }: SetAccountTypeOption) {
		const gameAccount = await this.accountRepo.update({ num: accountNum }, { accountType: accountType });
		await interaction.reply({
			content: `已成功設置 ID 為 ${gameAccount.id} 的帳號類型為 ${getAccountTypeName(accountType)}`,
			options: { flags: [MessageFlagsBitField.Flags.SuppressNotifications] },
		});
	}

	@Subcommand({ name: "reward-point", description: "計算當前隊員的積分點" })
	async onCalculateRewardPoint(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply();
		const accounts = (await this.accountRepo.accounts({
			id: true,
			accountType: true,
			personalRating: true,
			memberId: true,
			num: true,
		})) as AccountSeasonResult[];

		const results = this.rewardPointService.calculate(accounts, async (message) => {
			console.log(message);
		});

		const groups = groupBy(
			results.filter((result) => result.point > 0),
			(result) => result.memberId,
		);

		const messages = [];
		for (const groupsKey in groups) {
			messages.push(
				[
					`## <@${groupsKey}>`,
					...groups[groupsKey].map((calculateResult) =>
						[
							`* ${calculateResult.id}：${calculateResult.point} 積分 原因`,
							...calculateResult.reasons.map((reason) => `\t* ${reason}`),
						].join("\n"),
					),
				].join("\n"),
			);
		}

		for (let i = 0; i < messages.length; i += 10) {
			const message = messages.slice(i, i + 10).join("\n");
			await interaction.followUp({ content: message.replace("_", "\\_") });
		}
	}
}
