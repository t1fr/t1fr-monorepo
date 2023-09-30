import { Injectable, Logger } from "@nestjs/common";
import { Context, ContextOf, On, Once } from "necord";
import { MemberService } from "@/modules/management/member/member.service";

@Injectable()
export class DiscordListener {
	private readonly logger = new Logger(DiscordListener.name);

	constructor(private memberRepo: MemberService) {}

	@Once("ready")
	public onReady(@Context() [client]: ContextOf<"ready">) {
		if (client.user && client.application) this.logger.log(`Ready! Logged in as ${client.user.tag}`);
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
