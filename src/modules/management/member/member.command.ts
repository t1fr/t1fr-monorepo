import { Injectable, UseInterceptors } from "@nestjs/common";
import { Context, createCommandGroupDecorator, NumberOption, Options, SlashCommandContext, StringOption, Subcommand } from "necord";
import { MemberService } from "@/modules/management/member/member.service";
import { MyAutocompleteInterceptor } from "@/modules/management/account/account.autocomplete";

const MemberCommandDecorator = createCommandGroupDecorator({
	name: "member",
	description: "管理聯隊內的 DC 帳號",
});

class AwardOption {
	@StringOption({ name: "member", description: "擁有者 DC 帳號", required: true, autocomplete: true })
	memberDiscordId: string;

	@NumberOption({ name: "delta", description: "變化量", required: true })
	delta: number;
	@StringOption({ name: "reason", description: "原因" })
	reason: string;
}

@MemberCommandDecorator()
@Injectable()
export class MemberCommand {
	constructor(private memberService: MemberService) {}

	@Subcommand({ name: "award", description: "更改成員獎勵積分" })
	@UseInterceptors(MyAutocompleteInterceptor)
	async award(@Context() [interaction]: SlashCommandContext, @Options() { memberDiscordId, delta, reason }: AwardOption) {
		if (delta === 0) return interaction.reply({ content: "沒有變化，忽略" });

		await this.memberService.award(memberDiscordId, delta, reason);
		interaction.reply({ content: delta > 0 ? `已成功增加 ${delta} 點` : `已成功扣除 ${-delta} 點` });
	}
}
