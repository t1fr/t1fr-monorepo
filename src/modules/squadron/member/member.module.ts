import { Module } from "@nestjs/common";
import { MemberRepo } from "@/modules/squadron/member/member.repo";
import { PrismaService } from "@/prisma.service";
import { MemberCommand } from "@/modules/squadron/member/bot/member.command";
import { MemberUserCommand } from "@/modules/squadron/member/bot/member.user.command";

@Module({
	providers: [PrismaService, MemberRepo, MemberCommand, MemberUserCommand],
	exports: [MemberRepo],
})
export default class MemberModule {}
