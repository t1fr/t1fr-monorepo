import { Context, TargetUser, UserCommand, UserCommandContext } from "necord";
import { GuildMember, User } from "discord.js";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { Injectable, Logger } from "@nestjs/common";
import { DiscordRole } from "@/constant";

@Injectable()
export class MemberUserCommand {
	private readonly logger = new Logger(MemberUserCommand.name);

	constructor(private readonly memberRepo: MemberRepo) {}

	@UserCommand({ name: "給予聯隊戰隊員身分" })
	public async setMemberToFighter(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id)!;
		const { success, message } = await this.updateRoles(
			member,
			"給予聯隊戰隊員身分",
			[DiscordRole.聯隊戰身分群, DiscordRole.聯隊戰隊員],
			[DiscordRole.休閒隊員],
		);
		await this.memberRepo.upsert([{ _id: member.id, nickname: member.nickname ?? member.displayName }]);
		return interaction.reply({ content: success ? `已成功給予 <@${member?.id}> 聯隊戰隊員身分組` : message });
	}

	@UserCommand({ name: "給予休閒隊員身分" })
	public async setMemberToRelaxer(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id)!;
		const { success, message } = await this.updateRoles(
			member,
			"給予休閒隊員身分",
			[DiscordRole.休閒隊員],
			[DiscordRole.聯隊戰身分群, DiscordRole.聯隊戰隊員],
		);
		await this.memberRepo.upsert([{ _id: member.id, nickname: member.nickname ?? member.displayName }]);
		return interaction.reply({ content: success ? `已成功給予 <@${member?.id}> 休閒隊員身分組` : message });
	}

	@UserCommand({ name: "移除隊員身分" })
	public async disbandTeammate(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id)!;
		const { success, message } = await this.updateRoles(
			member,
			"移除隊員身分",
			[],
			[DiscordRole.休閒隊員, DiscordRole.聯隊戰身分群, DiscordRole.聯隊戰隊員],
		);
		return interaction.reply({ content: success ? `已成功移除 <@${member?.id}> 隊員身分組` : message });
	}

	private async updateRoles(member: GuildMember, reason: string, add: string[], remove: string[]) {
		try {
			const rolesManager = member.roles;
			await rolesManager.add(add, reason);
			await rolesManager.remove(remove, reason);
		} catch (e: any) {
			return { success: false, message: `${e.name}: ${e.message}` };
		}
		return { success: true, message: "" };
	}
}
