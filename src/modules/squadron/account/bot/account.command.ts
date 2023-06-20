import { Injectable, Logger, UseInterceptors } from "@nestjs/common";
import { BooleanOption, Context, createCommandGroupDecorator, NumberOption, Options, SlashCommandContext, StringOption, Subcommand } from "necord";
import { MessageFlagsBitField } from "discord.js";
import { getAccountTypeName } from "@/modules/squadron/account/account-type.enum";
import { AccountAutocompleteInterceptor } from "@/modules/squadron/account/bot/account.autocomplete";
import { AccountService } from "@/modules/squadron/account/account.service";

class SetAccountTypeOption {
	@NumberOption({ name: "account-id", description: "戰雷 ID", required: true, autocomplete: true })
	accountNum: number;

	@NumberOption({ name: "account-type", description: "帳號類型", required: true, autocomplete: true })
	accountType: number;
}

class SetOwnershipOption {
	@NumberOption({ name: "account-id", description: "戰雷 ID", required: true, autocomplete: true })
	accountNum: number;

	@StringOption({ name: "member", description: "擁有者 DC 帳號", required: true, autocomplete: true })
	memberDiscordId: string;
}

class CalculateRewardPointOption {
	@BooleanOption({ name: "simulate", description: "是否試算，不紀錄結果", required: true })
	isSimulate: boolean = true;
}

const AccountCommandGroup = createCommandGroupDecorator({
	name: "account",
	description: "管理聯隊內的 WT 帳號",
});

@Injectable()
@AccountCommandGroup()
export class AccountCommand {
	private readonly logger = new Logger(AccountCommand.name);

	constructor(readonly accountService: AccountService) {}

	@Subcommand({ name: "fetch", description: "從網頁上爬帳號資料" })
	private async onFetch(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply();
		const accounts = await this.accountService.fetchAccounts();
		interaction.editReply({ content: accounts ? `成功更新 ${accounts.length} 位隊員資料` : "更新失敗" });
	}

	@Subcommand({ name: "set-owner", description: "指定擁有者" })
	@UseInterceptors(AccountAutocompleteInterceptor)
	private async onSetOwner(@Context() [interaction]: SlashCommandContext, @Options() { accountNum, memberDiscordId }: SetOwnershipOption) {
		const gameAccount = await this.accountService.setAccountOwner(accountNum, memberDiscordId);
		await interaction.reply({
			content: `已成功設置 ID 為 ${gameAccount.id} 的帳號擁有者為 <@${memberDiscordId}>`,
			options: { flags: [MessageFlagsBitField.Flags.SuppressNotifications] },
		});
	}

	@Subcommand({ name: "autolink", description: "自動根據 DC 暱稱後方的 ID 來連結帳號。如果帳號類型未定義，將由連結成員的身分組推斷" })
	private async onAutolink(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply();
		const { linkableCount, successCount, failedCount, unlinkableIds } = await this.accountService.linkAccountAndMember();
		const content = [
			`可連結 ${linkableCount} 個帳號`,
			`成功儲存 ${successCount} 個帳號`,
			`　　失敗 ${failedCount} 個帳號`,
			"另以下帳號無法建立連結",
			"```",
			...unlinkableIds,
			"```",
		].join("\n");
		interaction.followUp({ content: content });
	}

	@UseInterceptors(AccountAutocompleteInterceptor)
	@Subcommand({ name: "set-type", description: "設定帳號類型" })
	private async onSetType(@Context() [interaction]: SlashCommandContext, @Options() { accountNum, accountType }: SetAccountTypeOption) {
		const gameAccount = await this.accountService.setAccountType(accountNum, accountType);
		await interaction.reply({
			content: `已成功設置 ID 為 ${gameAccount.id} 的帳號類型為 ${getAccountTypeName(accountType)}`,
			options: { flags: [MessageFlagsBitField.Flags.SuppressNotifications] },
		});
	}

	@Subcommand({ name: "reward-point", description: "計算當前隊員的積分點" })
	async onCalculateRewardPoint(@Context() [interaction]: SlashCommandContext, @Options() { isSimulate }: CalculateRewardPointOption) {
		await interaction.deferReply();
		const messages = await this.accountService.calculateRewardPoint(isSimulate);

		for (let i = 0; i < messages.length; i += 10) {
			const message = messages.slice(i, i + 10).join("\n");
			interaction.followUp({ content: message.replace("_", "\\_") });
		}
	}
}
