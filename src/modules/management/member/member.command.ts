import { Injectable, UseInterceptors } from "@nestjs/common";
import { Context, createCommandGroupDecorator, NumberOption, Options, SlashCommand, SlashCommandContext, StringOption, Subcommand } from "necord";
import { MemberService } from "@/modules/management/member/member.service";
import { MyAutocompleteInterceptor } from "@/modules/management/account/account.autocomplete";
import { PointType, RewardPointCategory } from "@/modules/management/point/point.schema";
import { EmbedBuilder } from "discord.js";
import { Summary } from "@/modules/management/member/member.repo";

const MemberCommandDecorator = createCommandGroupDecorator({
	name: "member",
	description: "管理聯隊內的 DC 帳號",
});

class AwardOption {
	@StringOption({ name: "member", description: "擁有者 DC 帳號", required: true, autocomplete: true })
	member: string;

	@NumberOption({ name: "delta", description: "變化量", required: true })
	delta: number;

	@StringOption({ name: "category", description: "分類", required: true })
	category: RewardPointCategory;

	@StringOption({ name: "reason", description: "原因" })
	comment: string;
}

class PointListOption {
	@StringOption({
		name: "type",
		description: "積分類型",
		required: true,
		choices: Object.values(PointType).map((type) => ({ name: type, value: type })),
	})
	type: PointType;
}

class MemberInfoOption {
	@StringOption({ name: "member", description: "成員", required: true, autocomplete: true })
	member: string;
}

@MemberCommandDecorator()
@Injectable()
export class MemberCommand {
	constructor(private memberService: MemberService) {}

	@SlashCommand({ name: "me", description: "顯示個人資訊、擁有帳號、各項點數" })
	async summary(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply({ ephemeral: true });
		const summary = await this.memberService.summary(interaction.user.id);
		const embeds = MemberCommand.summaryToEmbeds(summary);
		interaction.followUp({ embeds, ephemeral: true });
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

		const embeds = [new EmbedBuilder().setTitle("帳號列表").setFields(accountFields).setColor("#0071f3").setAuthor({ name: nickname })];
		points.forEach((point) => {
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
		interaction.followUp({ embeds });
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
		interaction.followUp({ embeds });
	}
}
