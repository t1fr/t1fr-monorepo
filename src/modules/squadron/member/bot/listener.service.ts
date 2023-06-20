import { Injectable, Logger } from "@nestjs/common";
import { Context, ContextOf, On, Once } from "necord";
import { MemberRepo } from "@/modules/squadron/member/member.repo";
import { MemberType } from "@/modules/squadron/member/member-type.enum";
import { BotConfigRepo } from "@/modules/bot-config/bot-config.repo";

@Injectable()
export class DiscordListenerService {
	private readonly logger = new Logger(DiscordListenerService.name);
	constructor(private memberRepo: MemberRepo, private configService: BotConfigRepo) {}

	private get coreRoleId() {
		return this.configService.getValue("bot.roles.core_player");
	}

	private get casualRoleId() {
		return this.configService.getValue("bot.roles.casual_player");
	}

	private get squadBattleRoleId() {
		return this.configService.getValue("bot.roles.squad_battle");
	}


	@Once("ready")
	public onReady(@Context() [client]: ContextOf<"ready">) {
		if (client.user && client.application) {
			this.logger.log(`Ready! Logged in as ${client.user.tag}`);
		}
	}

	@On("debug")
	onDebug(@Context() [message]: ContextOf<"debug">) {
		this.logger.debug(message);
	}

	@On("guildMemberNicknameUpdate")
	async onGuildMemberNicknameUpdate(@Context() [member, oldNickname, newNickname]: ContextOf<"guildMemberNicknameUpdate">) {
		const memberRoleIdCollection = [await this.casualRoleId, await this.coreRoleId];
		const roles = member.roles.cache;
		const roleId = roles.findKey((role, key) => memberRoleIdCollection.includes(key));
		if (roleId) {
			await this.memberRepo.update({ discordId: member.id }, { nickname: newNickname });
		}
	}

	@On("guildMemberRoleAdd")
	async onGuildMemberRoleAdd(@Context() [member, role]: ContextOf<"guildMemberRoleAdd">) {
		switch (role.id) {
			case await this.coreRoleId:
				await this.memberRepo.upsert({
					discordId: member.id,
					nickname: member.nickname ?? member.user.username,
					memberType: MemberType.CORE,
				});
				break;
			case await this.casualRoleId:
				await this.memberRepo.upsert({
					discordId: member.id,
					nickname: member.nickname ?? member.user.username,
					memberType: MemberType.CASUAL,
				});
				break;
		}
	}

	@On("guildMemberRoleRemove")
	async onGuildMemberRoleRemove(@Context() [member, role]: ContextOf<"guildMemberRoleRemove">) {
		switch (role.id) {
			case await this.squadBattleRoleId:
				await this.memberRepo.delete({ discordId: member.id });
		}
	}
}
