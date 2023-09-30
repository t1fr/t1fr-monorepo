import { Module } from "@nestjs/common";
import { AccountModule } from "@/modules/management/account/account.module";
import { MemberModule } from "@/modules/management/member/member.module";

@Module({
	imports: [MemberModule, AccountModule],
	exports: [MemberModule, AccountModule],
})
export class ManagementModule {}
