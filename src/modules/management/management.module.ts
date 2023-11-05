import { Module } from "@nestjs/common";
import { AccountModule } from "@/modules/management/account/account.module";
import { MemberModule } from "@/modules/management/member/member.module";
import PointModule from "@/modules/management/point/point.module";

@Module({
	imports: [MemberModule, AccountModule, PointModule],
	exports: [MemberModule, AccountModule, PointModule],
})
export class ManagementModule {}
