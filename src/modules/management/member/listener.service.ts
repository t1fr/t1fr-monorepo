import { Injectable, Logger } from "@nestjs/common";
import { Context, ContextOf, On, Once } from "necord";
import { MemberRepo } from "@/modules/management/member/member.repo";

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
	async onGuildMemberNicknameUpdate(@Context() [member, , newNickname]: ContextOf<"guildMemberNicknameUpdate">) {
		await this.memberRepo.update(member.id, { nickname: newNickname });
	}
}
