import { Module } from "@nestjs/common";
import { MemberRepo } from "@/modules/squadron/member/member.repo";
import { AccountRepo } from "@/modules/squadron/account/account.repo";
import { PrismaService } from "@/prisma.service";
import { MemberCommand } from "@/modules/squadron/member/member.command";
import { MemberUserCommand } from "@/modules/squadron/member/member.user.command";

@Module({
	providers: [PrismaService, MemberRepo, MemberCommand, MemberUserCommand],
	exports: [MemberRepo],
})
export default class MemberModule {}
