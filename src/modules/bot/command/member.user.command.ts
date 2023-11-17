import { Context, TargetUser, UserCommand, UserCommandContext } from "necord";
import { User } from "discord.js";
import { MemberService, UpdateMemberAction } from "@/modules/management/member/member.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MemberUserCommand {
	constructor(private readonly memberService: MemberService) {}

	@UserCommand({ name: "任命為聯隊戰隊員" })
	public async setMemberToFighter(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		if (!member) return interaction.reply({ content: "成員不存在" });
		const content = await this.memberService.updateMemberState(UpdateMemberAction.ToBattle, member);
		interaction.reply({ content });
	}

	@UserCommand({ name: "任命為休閒隊員" })
	public async setMemberToRelaxer(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		if (!member) return interaction.reply({ content: "成員不存在" });
		const content = await this.memberService.updateMemberState(UpdateMemberAction.ToRelax, member);
		interaction.reply({ content });
	}

	@UserCommand({ name: "移除隊員身分" })
	public async disbandTeammate(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		if (!member) return interaction.reply({ content: "成員不存在" });
		const content = await this.memberService.updateMemberState(UpdateMemberAction.Disband, member);
		interaction.reply({ content });
	}
}
