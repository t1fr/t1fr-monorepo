import { Injectable, Logger } from "@nestjs/common";
import { Context, ContextOf, On, Once } from "necord";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { DiscordRole } from "@/constant";

@Injectable()
export class DiscordListenerService {
	private readonly logger = new Logger(DiscordListenerService.name);

	constructor(private memberRepo: MemberRepo) {}

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
		const memberRoleIdCollection = [DiscordRole.聯隊戰隊員, DiscordRole.休閒隊員];
		const roles = member.roles.cache;
		const roleId = roles.findKey((role, key) => memberRoleIdCollection.includes(key));
		if (roleId) await this.memberRepo.upsert([{ _id: member.id, nickname: newNickname }]);
	}

	@On("guildMemberRoleAdd")
	async onGuildMemberRoleAdd(@Context() [member, role]: ContextOf<"guildMemberRoleAdd">) {}

	@On("guildMemberRoleRemove")
	async onGuildMemberRoleRemove(@Context() [member, role]: ContextOf<"guildMemberRoleRemove">) {}
}
