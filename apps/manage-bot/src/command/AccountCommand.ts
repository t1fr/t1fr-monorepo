import { Inject, Injectable, UseInterceptors } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { AssignAccountOwner, InvalidAccountTypeCountError, MemberNotFoundError } from "@t1fr/backend/member-manage";
import { MessageFlagsBitField } from "discord.js";
import { Context, createCommandGroupDecorator, Options, type SlashCommandContext, Subcommand } from "necord";
import { AccountAutocompleteInterceptor } from "../autocomplete";
import { SetOwnershipOption } from "./AccountOption";

const AccountCommandGroup = createCommandGroupDecorator({ name: "account", description: "管理聯隊內的 WT 帳號" });

@Injectable()
@AccountCommandGroup()
export class AccountCommand {
    @Inject()
    private readonly commandBus!: CommandBus;

    @Subcommand({ name: "sync", description: "從網頁上爬帳號資料" })
    private async sync(@Context() [interaction]: SlashCommandContext) {
        await interaction.reply("同步聯隊遊戲帳號完畢");
        // const result = await this.commandBus.execute(new ScrapeAccount());
        // result
        //     .map(info => interaction.followUp([
        //         "同步聯隊遊戲帳號完畢",
        //         `新增 ${info.inserted} 個帳號`,
        //         `修改 ${info.modified} 個帳號`,
        //         `刪除 ${info.deleted} 個帳號`,
        //     ].join("\n")))
        //     .mapErr(error => interaction.followUp(error.toString()));
    }


    @Subcommand({ name: "set-owner", description: "指定擁有者" })
    @UseInterceptors(AccountAutocompleteInterceptor)
    private async setOwner(@Context() [interaction]: SlashCommandContext, @Options() { accountId, guildMember }: SetOwnershipOption) {
        const result = await this.commandBus.execute(new AssignAccountOwner({ accountId: accountId, memberId: guildMember.id }));
        return result
            .map(({ account, newOwnerId, oldOwnerId }) => {
                const content = oldOwnerId
                    ? `已成功將帳號 ${account.name} 的從 ${oldOwnerId} 轉移給 <@${newOwnerId}>`
                    : `已成功設置帳號 ${account.name} 的擁有者為 <@${newOwnerId}>`;

                interaction.reply({
                    content: content,
                    options: { flags: [MessageFlagsBitField.Flags.SuppressNotifications] },
                });

            })
            .mapErr((error) => {
                if (error instanceof InvalidAccountTypeCountError) interaction.reply({ content: `<@${error.memberId.value}> ${error.toString()}` });
                else if (error instanceof MemberNotFoundError) interaction.reply(`<@${error.memberId}> 目前非隊員`);
                else interaction.reply(error.toString());
            });
    }

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
}
