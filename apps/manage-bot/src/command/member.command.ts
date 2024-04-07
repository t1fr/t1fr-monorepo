import { Injectable } from "@nestjs/common";
import { Context, createCommandGroupDecorator, Ctx, Modal, ModalContext, ModalParam, Options, SlashCommand, SlashCommandContext, Subcommand } from "necord";
import { Client, EmbedBuilder, escapeMarkdown, GuildMember, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { configLayout, selectToFields } from "../utlity";
import { MemberService, PointTypes } from "@t1fr/legacy/management";
import { JoinOption, PointListOption } from "../option";
import { Channel } from "../constant";

const MemberCommandDecorator = createCommandGroupDecorator({ name: "member", description: "管理聯隊內的 DC 帳號" });

@MemberCommandDecorator()
@Injectable()
export class MemberCommand {
	constructor(private readonly client: Client, private readonly memberService: MemberService) {
	}

	static ChangeNicknameModal = new ModalBuilder({
		components: configLayout([
			new TextInputBuilder({ customId: "name", label: "暱稱", style: TextInputStyle.Short }),
			new TextInputBuilder({ customId: "game-id", label: "遊戲 ID", style: TextInputStyle.Short, required: true }),
		]),
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

	static JoinModal = new ModalBuilder({
		components: configLayout([
			new TextInputBuilder({ customId: "game-id", label: "遊戲 ID", style: TextInputStyle.Short, required: true }),
			new TextInputBuilder({ customId: "level", label: "遊戲等級", style: TextInputStyle.Short, required: true }),
			new TextInputBuilder({ customId: "accept", label: "已閱讀並同意入隊須知", placeholder: "是 / 否", style: TextInputStyle.Short, required: true }),
		]),
		title: "申請加入 T1FR",
	});

	@SlashCommand({ name: "join", description: "提交加入 T1FR 的申請" })
	async join(@Context() [interaction]: SlashCommandContext, @Options() { type }: JoinOption) {
		await interaction.showModal(MemberCommand.JoinModal.setCustomId(`join/${type}`));
	}

	@Modal("join/:type")
	async onJoinSubmit(@Ctx() [interaction]: ModalContext, @ModalParam("type") type: string) {
		const accept = interaction.fields.getTextInputValue("accept");
		if (accept !== "是") return await interaction.reply({ content: `請閱讀 <#${Channel.入隊須知}> 後再申請`, ephemeral: true });
		const gameId = interaction.fields.getTextInputValue("game-id");
		const level = interaction.fields.getTextInputValue("level");
		const applyChannel = this.client.channels.resolve(Channel.入隊申請窗口) as TextChannel;
		const message = await applyChannel.send({
			content: [
				`申請人： <@${interaction.user.id}>`,
				`ID： ${escapeMarkdown(gameId)}`,
				`等級： ${level}`,
				`申請隊員類型： ${type}`,
				"已閱讀並同意入隊須知： 是",
			].join("\n"),
		});

		await interaction.reply({ content: `已[申請](<${message.url}>)成功，請等候軍官確認`, ephemeral: true });
	}

	@Subcommand({ name: "sync", description: "同步 DC 帳號到資料庫" })
	private async onSync(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply();
		await this.memberService.sync();
		await interaction.followUp({ content: "成功更新 DC 隊員資料" });
	}

	@Subcommand({ name: "point-summary", description: "顯示各成員的點數和" })
	async listPoint(@Context() [interaction]: SlashCommandContext, @Options() { type }: PointListOption) {
		await interaction.deferReply();
		const results = await this.memberService.listMemberWithStatistic();
		const typeSelection = type ? [type] : PointTypes;
		const title = `${type ?? ""}點數總和`;
		const embeds = [];
		const headers = ["暱稱", ...typeSelection];
		for (let i = 0; i < results.length; i += 25) {
			const fields = selectToFields(results.slice(i, i + 25), ["nickname", ...typeSelection], headers);
			embeds.push(new EmbedBuilder().setTitle(title).setFields(...fields).setColor("#0071f3"));
		}

		await interaction.followUp({ embeds });
	}
}
