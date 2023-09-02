import { Context, TargetUser, UserCommand, UserCommandContext } from "necord";
import { GuildMember, User } from "discord.js";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MemberUserCommand {
	private readonly logger = new Logger(MemberUserCommand.name);

	private readonly coreRoleId = "1046629026355228762";
	private readonly casualRoleId = "1103384315599015987";
	private readonly squadBattleRoleId = "1054766361991204864";

	constructor() {}

	@UserCommand({ name: "給予聯隊戰隊員身分" })
	public async setMemberToFighter(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		const [isSuccess, message] = await this.setMemberRole(member, true, false);
		return interaction.reply({ content: isSuccess ? `已成功給予 <@${member?.id}> 聯隊戰隊員身分組` : message });
	}

	@UserCommand({ name: "給予休閒隊員身分" })
	public async setMemberToRelaxer(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		const [isSuccess, message] = await this.setMemberRole(member, false, true);
		return interaction.reply({ content: isSuccess ? `已成功給予 <@${member?.id}> 休閒隊員身分組` : message });
	}

	@UserCommand({ name: "移除隊員身分" })
	public async disbandTeammate(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		const [isSuccess, message] = await this.setMemberRole(member, false, false);
		return interaction.reply({ content: isSuccess ? `已成功移除 <@${member?.id}> 隊員身分組` : message });
	}

	private async setMemberRole(member: GuildMember | null | undefined, isCore: boolean, isCasual: boolean): Promise<[boolean, string]> {
		let message = "";
		let isSuccess = false;

		if (member) {
			try {
				const rolesManager = member.roles;
				await Promise.all([
					isCasual ? rolesManager.add(this.casualRoleId) : rolesManager.remove(this.casualRoleId),
					isCore ? rolesManager.add(this.coreRoleId, this.squadBattleRoleId) : rolesManager.remove(this.coreRoleId, this.squadBattleRoleId),
				]);
				isSuccess = true;
			} catch (e: any) {
				message = `${e.name}: ${e.message}`;
			}
		} else {
			message = "找不到伺服器，可能是因為在私人訊息使用該命令";
		}
		return [isSuccess, message];
	}
}
