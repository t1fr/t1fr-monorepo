import { GuildMember } from "discord.js";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { MemberChangeAction, MemberChangeEvent } from "./member.event";
import { MemberService } from "./member.service";

export class MemberChangeCommand {
	constructor(readonly member: GuildMember, readonly action: MemberChangeAction) {
	}
}

@CommandHandler(MemberChangeCommand)
export class MemberChangeCommandHandler implements ICommandHandler<MemberChangeCommand> {

	constructor(private readonly memberService: MemberService,
		private readonly eventBus: EventBus,
	) {
	}

	private static createWelcomeMessage(member: GuildMember, type: "聯隊戰" | "休閒") {
		const message = [`您好，<@${member.id}>`, `您已成為 T1FR ${type}隊員`];

		if (!member.displayName.match(/^[^丨].*(丨.*)?丨.*[^丨]$/))
			message.push("請將伺服器個人暱稱用 `/nickname` 指令或手動改為：", "```", "T1FR丨您的暱稱丨您的戰雷ID", "```");

		return message.join("\n");
	}

	async execute(command: MemberChangeCommand): Promise<string> {
		const { member, action } = command;
		const { id } = member;
		this.eventBus.publish(new MemberChangeEvent(member, action));
		switch (action) {
			case MemberChangeAction.AS_FIGHTER: {
				await this.memberService.upsert({ _id: member.id, nickname: member.displayName });
				return MemberChangeCommandHandler.createWelcomeMessage(member, "聯隊戰");
			}
			case MemberChangeAction.AS_RELAXER: {
				await this.memberService.upsert({ _id: member.id, nickname: member.displayName });
				return MemberChangeCommandHandler.createWelcomeMessage(member, "休閒");
			}
			case MemberChangeAction.DISBAND: {
				await this.memberService.upsert({ _id: id, isExist: false });
				return `已成功移除 <@${id}> 隊員身分組`;
			}
		}
	}
}