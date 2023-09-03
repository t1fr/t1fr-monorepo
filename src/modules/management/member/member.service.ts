import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Client, GuildMember } from "discord.js";
import { DiscordRole } from "@/constant";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { Member } from "@/modules/management/member/member.schema";
import { RewardService } from "@/modules/management/point/reward.service";

@Injectable()
export class MemberService implements OnModuleInit {
	private readonly logger = new Logger(MemberService.name);

	constructor(
		private readonly client: Client,
		private readonly memberRepo: MemberRepo,
		private readonly rewardService: RewardService,
	) {}

	async onModuleInit() {
		const guild = this.client.guilds.resolve("1046623840710705152");
		if (!guild) return;
		const members = await guild.members.fetch();
		if (!members) return;

		const result = await this.memberRepo.upsert(
			members
				.filter((member) => member.roles.cache.hasAny(DiscordRole.聯隊戰隊員, DiscordRole.休閒隊員))
				.map(MemberService.TransformDiscordMemberToMember),
		);

		this.logger.log(`已成功將現有 ${result.upsertedCount} 隊員存入資料庫`);
	}

	static TransformDiscordMemberToMember(member: GuildMember): Member {
		return { _id: member.id, nickname: member.nickname ?? member.displayName };
	}

	async award(member: string, delta: number, reason: string) {
		await this.rewardService.appendRaw(member, delta, reason);
	}
}
