import { Module } from "@nestjs/common";
import { AccountModule } from "./account/account.module";
import { MemberModule } from "./member/member.module";
import PointModule from "./point/point.module";

@Module({
	imports: [MemberModule, AccountModule, PointModule],
	exports: [MemberModule, AccountModule, PointModule],
})
export class ManagementModule {}
