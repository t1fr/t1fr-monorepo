import { Injectable, UseInterceptors } from "@nestjs/common";
import { Context, createCommandGroupDecorator, NumberOption, Options, SlashCommandContext, StringOption, Subcommand } from "necord";
import { MemberService } from "@/modules/management/member/member.service";
import { MyAutocompleteInterceptor } from "@/modules/management/account/account.autocomplete";
import { RewardPointCategory } from "@/modules/management/point/point.schema";
import { EmbedBuilder } from "discord.js";

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

@MemberCommandDecorator()
@Injectable()
export class MemberCommand {
	constructor(private memberService: MemberService) {}

	@Subcommand({ name: "award", description: "更改成員獎勵積分" })
	@UseInterceptors(MyAutocompleteInterceptor)
	async award(@Context() [interaction]: SlashCommandContext, @Options() parameters: AwardOption) {
		const delta = parameters.delta;
		if (delta === 0) return interaction.reply({ content: "沒有變化，忽略" });

		await this.memberService.award(parameters);
		interaction.reply({ content: delta > 0 ? `已成功增加 ${delta} 點` : `已成功扣除 ${-delta} 點` });
	}

	@Subcommand({ name: "me", description: "顯示個人資訊、擁有帳號、各項點數" })
	async summary(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply({ ephemeral: true });
		const { points, accounts } = await this.memberService.summary(interaction.user.id);

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

		const embeds = [new EmbedBuilder().setTitle("帳號列表").setFields(accountFields).setColor("#0071f3")];
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

			embeds.push(new EmbedBuilder().setTitle(point._id).setDescription(`總和：${point.sum}`).setFields(logFields));
		});

		interaction.followUp({ embeds, ephemeral: true });
	}
}
