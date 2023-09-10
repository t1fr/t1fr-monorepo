import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Client, GuildMember } from "discord.js";
import { DiscordRole } from "@/constant";
import { MemberRepo, Summary } from "@/modules/management/member/member.repo";
import { Member } from "@/modules/management/member/member.schema";
import { PointRepo } from "@/modules/management/point/point.repo";
import { PointEvent, PointType } from "@/modules/management/point/point.schema";
import dayjs from "dayjs";
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MemberService {
	private readonly logger = new Logger(MemberService.name);

	constructor(
		private readonly client: Client,
		private readonly memberRepo: MemberRepo,
		private readonly pointRepo: PointRepo,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_8AM)
	async sync() {
		const guild = await this.client.guilds.fetch({ guild: "1046623840710705152", force: true });
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

	async award(event: Omit<PointEvent, "type" | "date">) {
		this.pointRepo.append(PointType.REWARD, { ...event, date: dayjs().format("YYYY-MM-DD") });
	}

	async summary(userId: string): Promise<Summary> {
		return this.memberRepo.summary(userId);
	}

	async listPoint(type: PointType) {
		return this.memberRepo.listPoint(type);
	}
}
