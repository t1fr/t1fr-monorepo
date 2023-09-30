import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConnectionName } from "@/constant";
import { MemberModelDef } from "@/modules/management/member/member.schema";
import { MemberController } from "@/modules/management/member/member.controller";
import { MemberService } from "@/modules/management/member/member.service";
import PointModule from "@/modules/management/point/point.module";

@Module({
	imports: [MongooseModule.forFeature([MemberModelDef], ConnectionName.Management), PointModule],
	providers: [MemberService],
	exports: [MemberService],
	controllers: [MemberController],
})
export class MemberModule {}