import { Inject, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ScrapeAccount, ScrapeAccountOutput } from "@t1fr/backend/member-manage";
import { Context, createCommandGroupDecorator, SlashCommandContext, Subcommand } from "necord";

const AccountCommandGroup = createCommandGroupDecorator({ name: "account", description: "管理聯隊內的 WT 帳號" });

@Injectable()
@AccountCommandGroup()
export class AccountCommand {
    @Inject()
    private readonly commandBus!: CommandBus;

    @Subcommand({ name: "sync", description: "從網頁上爬帳號資料" })
    private async sync(@Context() [interaction]: SlashCommandContext) {
        await interaction.deferReply();
        const result = await this.commandBus.execute<ScrapeAccount, ScrapeAccountOutput>(new ScrapeAccount());
        result
            .map(info => interaction.followUp([
                "同步聯隊遊戲帳號完畢",
                `新增 ${info.inserted} 個帳號`,
                `修改 ${info.modified} 個帳號`,
                `刪除 ${info.deleted} 個帳號`,
            ].join("\n")))
            .mapErr(error => interaction.followUp(error.toString()));
    }

    //
    // @Subcommand({ name: "set-owner", description: "指定擁有者" })
    // @UseInterceptors(UserAutocompleteInterceptor)
    // private async setOwner(@Context() [interaction]: SlashCommandContext, @Options() { accountId, memberDiscordId }: SetOwnershipOption) {
    // 	try {
    // 		const account = await this.accountService.updateAccount(accountId, { owner: memberDiscordId });
    // 		interaction.reply({
    // 			content: `已成功設置帳號 ${account.id} 的擁有者為 <@${account.owner}>`,
    // 			options: { flags: [MessageFlagsBitField.Flags.SuppressNotifications] },
    // 		});
    // 	} catch (error) {
    // 		interaction.reply({ content: error.toString() });
    // 	}
    // }
    //
    // @UseInterceptors(UserAutocompleteInterceptor)
    // @Subcommand({ name: "set-type", description: "設定帳號類型" })
    // private async setType(@Context() [interaction]: SlashCommandContext, @Options() { accountId, accountType }: SetAccountTypeOption) {
    // 	try {
    // 		const account = await this.accountService.updateAccount(accountId, { type: accountType });
    // 		interaction.reply({ content: `已成功設置帳號 ${account.id} 的類型為 ${account.type}` });
    // 	} catch (error) {
    // 		interaction.reply({ content: error.toString() });
    // 	}
    // }
    //
    // @Subcommand({ name: "autolink", description: "自動根據 DC 暱稱後方的 ID 來連結帳號。如果帳號類型未定義，將由連結成員的身分組推斷" })
    // private async autolink(@Context() [interaction]: SlashCommandContext) {
    // 	await interaction.deferReply();
    // 	const { linkable, modified, errors } = await this.accountService.joinOnId();
    // 	const content = [`可連結 ${linkable} 個帳號`, `已更新 ${modified} 個帳號`];
    // 	if (errors.length) content.push(...errors);
    // 	interaction.followUp({ content: content.join("\n") });
    // }
}
