import { Injectable, UseInterceptors } from "@nestjs/common";
import { BooleanOption, Context, createCommandGroupDecorator, Options, SlashCommandContext, StringOption, Subcommand } from "necord";
import { MessageFlagsBitField } from "discord.js";
import { UserAutocompleteInterceptor } from "@/modules/bot/autocomplete/user.autocomplete";
import { AccountService } from "@/modules/management/account/account.service";
import { AccountType, AccountTypes } from "@/modules/management/account/account.schema";

class SetAccountTypeOption {
	@StringOption({ name: "account-id", description: "戰雷 ID", required: true, autocomplete: true })
	accountId: string;

	@StringOption({ name: "account-type", description: "帳號類型", required: true, choices: AccountTypes.map(type => ({ name: type, value: type })) })
	accountType: AccountType;
}

class SetOwnershipOption {
	@StringOption({ name: "account-id", description: "戰雷 ID", required: true, autocomplete: true })
	accountId: string;

	@StringOption({ name: "member", description: "擁有者 DC 帳號", required: true, autocomplete: true })
	memberDiscordId: string;
}

class CalculateRewardPointOption {
	@BooleanOption({ name: "simulate", description: "是否試算，不紀錄結果", required: true })
	isSimulate: boolean = true;
	@BooleanOption({ name: "verbose", description: "是否顯示原因" })
	verbose: boolean = false;
}

const AccountCommandGroup = createCommandGroupDecorator({ name: "account", description: "管理聯隊內的 WT 帳號" });

@Injectable()
@AccountCommandGroup()
export class AccountCommand {
	constructor(readonly accountService: AccountService) {}
	@Subcommand({ name: "sync", description: "從網頁上爬帳號資料" })
	private async sync(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply();
		await this.accountService.sync();
		interaction.followUp({ content: "成功更新隊員資料" });
	}

	@Subcommand({ name: "set-owner", description: "指定擁有者" })
	@UseInterceptors(UserAutocompleteInterceptor)
	private async setOwner(@Context() [interaction]: SlashCommandContext, @Options() { accountId, memberDiscordId }: SetOwnershipOption) {
		try {
			const account = await this.accountService.updateAccount(accountId, { owner: memberDiscordId });
			interaction.reply({
				content: `已成功設置帳號 ${account.id} 的擁有者為 <@${account.owner}>`,
				options: { flags: [MessageFlagsBitField.Flags.SuppressNotifications] },
			});
		} catch (error) {
			interaction.reply({ content: error.toString() });
		}
	}

	@UseInterceptors(UserAutocompleteInterceptor)
	@Subcommand({ name: "set-type", description: "設定帳號類型" })
	private async setType(@Context() [interaction]: SlashCommandContext, @Options() { accountId, accountType }: SetAccountTypeOption) {
		try {
			const account = await this.accountService.updateAccount(accountId, { type: accountType });
			interaction.reply({ content: `已成功設置帳號 ${account.id} 的類型為 ${account.type}` });
		} catch (error) {
			interaction.reply({ content: error.toString() });
		}
	}

	@Subcommand({ name: "autolink", description: "自動根據 DC 暱稱後方的 ID 來連結帳號。如果帳號類型未定義，將由連結成員的身分組推斷" })
	private async autolink(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply();
		const { linkable, modified, errors } = await this.accountService.joinOnId();
		const content = [`可連結 ${linkable} 個帳號`, `已更新 ${modified} 個帳號`];
		if (errors.length) content.push(...errors);

		interaction.followUp({ content: content.join("\n") });
	}

	@Subcommand({ name: "reward-point", description: "計算當前隊員的積分點" })
	async onCalculateRewardPoint(@Context() [interaction]: SlashCommandContext, @Options() { isSimulate, verbose }: CalculateRewardPointOption) {
		interaction.reply({ ephemeral: true, content: "尚未實作" });
		// await interaction.deferReply();
		// let messages: string[] = [];
		// try {
		// 	messages = await this.accountService.calculateRewardPoint(isSimulate, verbose);
		// } catch (e) {
		// 	return interaction.followUp({ content: e });
		// }
		//
		// for (let i = 0; i < messages.length; i += 10) {
		// 	const message = messages.slice(i, i + 10).join("\n");
		// 	interaction.followUp({ content: message.replace("_", "\\_") });
		// }
	}
}
