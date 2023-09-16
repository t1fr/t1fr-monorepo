import { Injectable, UseInterceptors } from "@nestjs/common";
import {
	Context,
	createCommandGroupDecorator,
	Ctx,
	Modal,
	ModalContext,
	ModalParam,
	NumberOption,
	Options,
	SlashCommand,
	SlashCommandContext,
	StringOption,
	Subcommand,
} from "necord";
import { MemberService } from "@/modules/management/member/member.service";
import { MyAutocompleteInterceptor } from "@/modules/management/account/account.autocomplete";
import { PointType, RewardPointCategories, RewardPointCategory } from "@/modules/management/point/point.schema";
import { Client, EmbedBuilder, escapeMarkdown, GuildMember, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { Summary } from "@/modules/management/member/member.repo";
import { configLayout } from "@/utility";
import { Channel } from "@/constant";

const MemberCommandDecorator = createCommandGroupDecorator({
	name: "member",
	description: "管理聯隊內的 DC 帳號",
});

class AwardOption {
	@StringOption({ name: "member", description: "擁有者 DC 帳號", required: true, autocomplete: true })
	member: string;

	@NumberOption({ name: "delta", description: "變化量", required: true })
	delta: number;

	@StringOption({
		name: "category",
		description: "分類",
		required: true,
		choices: RewardPointCategories.map(category => ({ name: category, value: category })),
	})
	category: RewardPointCategory;

	@StringOption({ name: "reason", description: "原因" })
	comment: string;
}

class PointListOption {
	@StringOption({
		name: "type",
		description: "積分類型",
		required: true,
		choices: Object.values(PointType).map(type => ({ name: type, value: type })),
	})
	type: PointType;
}

class MemberInfoOption {
	@StringOption({ name: "member", description: "成員", required: true, autocomplete: true })
	member: string;
}

class JoinOption {
	@StringOption({
		name: "type",
		description: "申請項目",
		required: true,
		choices: ["休閒隊員", "轉聯隊戰隊員", "轉休閒隊員"].map(value => ({ name: value, value })),
	})
	type: string;
}

@MemberCommandDecorator()
@Injectable()
export class MemberCommand {
	constructor(private memberService: MemberService, private readonly client: Client,) {}

	@SlashCommand({ name: "me", description: "顯示個人資訊、擁有帳號、各項點數" })
	async summary(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply({ ephemeral: true });
		const summary = await this.memberService.summary(interaction.user.id);
		const embeds = MemberCommand.summaryToEmbeds(summary);
		await interaction.followUp({ embeds, ephemeral: true });
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

		await interaction.reply({
			content: `已[申請](<${message.url}>)成功，請等候軍官確認`,
			ephemeral: true,
		});
	}

	@Subcommand({ name: "award", description: "更改成員獎勵積分" })
	@UseInterceptors(MyAutocompleteInterceptor)
	async award(@Context() [interaction]: SlashCommandContext, @Options() parameters: AwardOption) {
		const delta = parameters.delta;
		if (delta === 0) return interaction.reply({ content: "沒有變化，忽略" });

		await this.memberService.award(parameters);
		interaction.reply({ content: delta > 0 ? `已成功增加 ${delta} 點` : `已成功扣除 ${-delta} 點` });
	}

	static summaryToEmbeds({ accounts, points, nickname }: Summary) {
		const embeds = [];

		if (accounts.length) {
			const accountReduce = accounts.reduce(
				(acc, cur) => {
					acc.id.push(`\`${cur._id}\``);
					acc.type.push(`\`${cur.type}\``);
					acc.activity.push(`\`${cur.activity}\``);
					acc.personalRating.push(`\`${cur.personalRating}\``);
					return acc;
				},
				{ id: [] as string[], activity: [] as string[], personalRating: [] as string[], type: [] as string[] },
			);
			const accountFields = [
				{ name: "遊戲 ID", value: accountReduce.id.join("\n"), inline: true },
				{ name: "類型", value: accountReduce.type.join("\n"), inline: true },
				{ name: "個人評分", value: accountReduce.personalRating.join("\n"), inline: true },
				{ name: "活躍度", value: accountReduce.activity.join("\n"), inline: true },
			];
			embeds.push(new EmbedBuilder().setTitle("帳號列表").setFields(accountFields).setColor("#0071f3").setAuthor({ name: nickname }));
		}

		points.forEach(point => {
			const logReduce = point.logs.reduce(
				(acc, cur) => {
					acc.date.push(`\`${cur.date}\``);
					acc.delta.push(`\`${cur.delta}\``);
					acc.category.push(`\`${cur.category}\``);
					acc.detail.push(`\`${cur.detail}\``);
					return acc;
				},
				{ date: [] as string[], delta: [] as string[], category: [] as string[], detail: [] as string[] },
			);
			const logFields = [
				{ name: "日期", value: logReduce.date.join("\n"), inline: true },
				{ name: "分類", value: logReduce.delta.join("\n"), inline: true },
				{ name: "變化", value: logReduce.category.join("\n"), inline: true },
				{ name: "原因", value: logReduce.detail.join("\n"), inline: true },
			];

			embeds.push(new EmbedBuilder().setTitle(point._id).setDescription(`總和：${point.sum}`).setFields(logFields).setAuthor({ name: nickname }));
		});

		return embeds;
	}

	@UseInterceptors(MyAutocompleteInterceptor)
	@Subcommand({ name: "info", description: "顯示特定成員的資訊、擁有帳號、各項點數" })
	async showInfo(@Context() [interaction]: SlashCommandContext, @Options() { member }: MemberInfoOption) {
		await interaction.deferReply();
		const summary = await this.memberService.summary(member);
		const embeds = MemberCommand.summaryToEmbeds(summary);
		await interaction.followUp({ embeds });
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
		const results = await this.memberService.listPoint(type);
		const memberReduce = results.reduce(
			(acc, cur) => {
				acc.nickname.push(`\`${cur.nickname}\``);
				acc.sum.push(`\`${cur.sum}\``);
				return acc;
			},
			{ nickname: [] as string[], sum: [] as string[] },
		);
		const fields = [
			{ name: "暱稱", value: memberReduce.nickname.join("\n"), inline: true },
			{ name: "總和", value: memberReduce.sum.join("\n"), inline: true },
		];

		const embeds = [new EmbedBuilder().setTitle(`${type}積分總和`).setFields(fields).setColor("#0071f3")];
		await interaction.followUp({ embeds });
	}
}
