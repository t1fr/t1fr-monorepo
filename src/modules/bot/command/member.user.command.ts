import { Context, TargetUser, UserCommand, UserCommandContext } from "necord";
import { GuildMember, User } from "discord.js";
import { MemberService } from "@/modules/management/member/member.service";
import { Injectable, Logger } from "@nestjs/common";
import { DiscordRole } from "@/constant";

@Injectable()
export class MemberUserCommand {
	private readonly logger = new Logger(MemberUserCommand.name);

	constructor(private readonly memberRepo: MemberService) {}

	createWelcomeMessage(member: GuildMember, type: "聯隊戰" | "休閒") {
		const message = [`您好，<@${member.id}>`, `您已成為 T1FR ${type}隊員`];

		if (!member.displayName.match(/^[^丨].*(丨.*)?丨.*[^丨]$/))
			message.push("請將伺服器個人暱稱用 `/nickname` 指令或手動改為：", "```", "T1FR丨您的暱稱丨您的戰雷ID", "```");

		return message.join("\n");
	}

	@UserCommand({ name: "任命為聯隊戰隊員" })
	public async setMemberToFighter(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		if (!member) return interaction.reply({ content: "成員不存在" });
		const { success, message } = await this.updateRoles(
			member,
			"給予聯隊戰隊員身分",
			[DiscordRole.聯隊戰身分群, DiscordRole.聯隊戰隊員],
			[DiscordRole.休閒隊員],
		);
		await this.memberRepo.upsert([{ _id: member.id, nickname: member.displayName }]);
		return interaction.reply({ content: success ? this.createWelcomeMessage(member, "聯隊戰") : message });
	}

	@UserCommand({ name: "任命為休閒隊員" })
	public async setMemberToRelaxer(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		if (!member) return interaction.reply({ content: "成員不存在" });
		const { success, message } = await this.updateRoles(member, "給予休閒隊員身分", [DiscordRole.休閒隊員], [DiscordRole.聯隊戰隊員]);
		await this.memberRepo.upsert([{ _id: member.id, nickname: member.displayName }]);
		return interaction.reply({ content: success ? this.createWelcomeMessage(member, "休閒") : message });
	}

	@UserCommand({ name: "切換隊員身分" })
	public async switchMemberType(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		if (!member) return interaction.reply({ content: "成員不存在" });
		const isRelaxer = member.roles.cache.some(role => role.id === DiscordRole.休閒隊員);
		const isFighter = member.roles.cache.some(role => role.id === DiscordRole.聯隊戰隊員);
		if ((isRelaxer && isFighter) || (!isRelaxer && !isFighter)) return interaction.reply({ content: "成員狀態錯誤" });
		const { success, message } = await this.updateRoles(
			member,
			"給予休閒隊員身分",
			[isRelaxer ? DiscordRole.聯隊戰隊員 : DiscordRole.休閒隊員],
			[isRelaxer ? DiscordRole.休閒隊員 : DiscordRole.聯隊戰隊員],
		);
		return interaction.reply({ content: success ? `已成功切換 <@${member?.id}> 隊員類型` : message });
	}

	@UserCommand({ name: "移除隊員身分" })
	public async disbandTeammate(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
		const member = interaction.guild?.members.resolve(user.id);
		if (!member) return interaction.reply({ content: "成員不存在" });
		const { success, message } = await this.updateRoles(member, "移除隊員身分", [], [DiscordRole.休閒隊員, DiscordRole.聯隊戰隊員]);
		return interaction.reply({ content: success ? `已成功移除 <@${member?.id}> 隊員身分組` : message });
	}

	private async updateRoles(member: GuildMember, reason: string, add: string[], remove: string[]) {
		try {
			const rolesManager = member.roles;
			await rolesManager.add(add, reason);
			await rolesManager.remove(remove, reason);
		} catch (e: unknown) {
			return { success: false, message: e as string };
		}
		return { success: true, message: "" };
	}
}
