import { Inject, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GuildMember, ModalBuilder, TextInputStyle } from "discord.js";
import { Context, createCommandGroupDecorator, Ctx, Modal, ModalContext, ModalParam, Options, SlashCommand, SlashCommandContext, Subcommand } from "necord";
import { DiscordClientService } from "../service";
import { configLayout } from "../utlity";
import { JoinOption } from "./MemberOption";

const MemberCommandDecorator = createCommandGroupDecorator({ name: "member", description: "管理聯隊內的 DC 帳號" });

@MemberCommandDecorator()
@Injectable()
export class MemberCommand {

    @Inject()
    private readonly discordClientService!: DiscordClientService;

    @Inject()
    private readonly commandBus!: CommandBus;

    static ChangeNicknameModal = new ModalBuilder({
        components: configLayout(
            { customId: "name", label: "暱稱", style: TextInputStyle.Short },
            { customId: "game-id", label: "遊戲 ID", style: TextInputStyle.Short, required: true },
        ),
        customId: "nickname",
        title: "更改伺服器個人暱稱",
    });

    @SlashCommand({ name: "nickname", description: "更改為符合格式的 DC 伺服器暱稱" })
    async changeNickname(@Context() [interaction]: SlashCommandContext) {
        await interaction.showModal(MemberCommand.ChangeNicknameModal);
    }

    @Modal("nickname")
    async onChangeNicknameModalSubmit(@Ctx() [interaction]: ModalContext) {
        const name = interaction.fields.getTextInputValue("name") ?? interaction.user.displayName;
        const gameId = interaction.fields.getTextInputValue("game-id");
        if (interaction.member instanceof GuildMember) await interaction.member.setNickname(`T1FR丨${name}丨${gameId}`, "更改為符合格式的 DC 伺服器暱稱");
        await interaction.reply({ content: "已更改暱稱", ephemeral: true });
    }

    private static JoinModal = new ModalBuilder({
        components: configLayout(
            { customId: "game-id", label: "遊戲 ID", style: TextInputStyle.Short, required: true },
            { customId: "level", label: "遊戲等級", style: TextInputStyle.Short, required: true },
            { customId: "accept", label: "已閱讀並同意入隊須知", placeholder: "是 / 否", style: TextInputStyle.Short, required: true },
        ),
        title: "申請加入 T1FR",
    });

    @SlashCommand({ name: "join", description: "提交加入 T1FR 的申請" })
    async join(@Context() [interaction]: SlashCommandContext, @Options() { type }: JoinOption) {
        await interaction.showModal(MemberCommand.JoinModal.setCustomId(`join/${type}`));
    }

    @Modal("join/:type")
    async onJoinSubmit(@Ctx() [interaction]: ModalContext, @ModalParam("type") type: string) {
        const accept = interaction.fields.getTextInputValue("accept");
        if (accept !== "是") return await interaction.reply({
            content: `請閱讀 <#${this.discordClientService.constants.channels.recruitment.notice}> 後再申請`,
            ephemeral: true,
        });
        const gameId = interaction.fields.getTextInputValue("game-id");
        const level = interaction.fields.getTextInputValue("level");
        const postOrError = await this.discordClientService.postApplication({ discordId: interaction.user.id, level, type, gameId });

        if (postOrError.isOk()) interaction.reply({ content: `已[申請](<${postOrError.value}>)成功，請等候軍官確認`, ephemeral: true });
        else interaction.reply(postOrError.error);
    }

    @Subcommand({ name: "sync", description: "同步 DC 帳號到資料庫" })
    private async sync(@Context() [interaction]: SlashCommandContext) {
        await interaction.deferReply();
        const result = await this.discordClientService.syncMember();
        if (result.isErr()) return interaction.followUp(result.error.toString());

        const { success, errors } = result.value;

        const content = [
            "同步聯隊 DC 帳號完畢",
            `已新增與更新 ${success} 個帳號`,
        ];

        if (errors.length) {
            content.push(`有 ${errors.length} 個帳號更新失敗，原因: `);
            content.push("```");
            content.push(errors.slice(0, 8).map(it => it.toString()).join("\n"));
            if (errors.length > 8) content.push(`以及其他 ${errors.length - 8} 項錯誤`);
            content.push("```");
        }

        interaction.followUp(content.join("\n"));
    }

    // @Subcommand({ name: "point-summary", description: "顯示各成員的點數和" })
    // async listPoint(@Context() [interaction]: SlashCommandContext, @Options() { type }: PointListOption) {
    //     await interaction.deferReply();
    //     const results = await this.memberService.listMemberWithStatistic();
    //     const typeSelection = type ? [type] : PointTypes;
    //     const title = `${type ?? ""}點數總和`;
    //     const embeds = [];
    //     const headers = ["暱稱", ...typeSelection];
    //     for (let i = 0; i < results.length; i += 25) {
    //         const fields = selectToFields(results.slice(i, i + 25), ["nickname", ...typeSelection], headers);
    //         embeds.push(new EmbedBuilder().setTitle(title).setFields(...fields).setColor("#0071f3"));
    //     }
    //
    //     await interaction.followUp({ embeds });
    // }
}
