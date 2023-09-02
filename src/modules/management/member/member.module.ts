import { Module } from "@nestjs/common";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { MemberCommand } from "@/modules/management/member/member.command";
import { MemberUserCommand } from "@/modules/management/member/member.user.command";
import { MongooseModule } from "@nestjs/mongoose";
import { MemberModelDef } from "@/modules/management/member/member.schema";

@Module({
	imports: [MongooseModule.forFeature([MemberModelDef])],
	providers: [MemberRepo, MemberCommand, MemberUserCommand],
	exports: [MemberRepo],
})
export default class MemberModule {}
