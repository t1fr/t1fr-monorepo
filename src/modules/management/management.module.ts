import { Module } from "@nestjs/common";
import { AccountModule } from "@/modules/management/account/account.module";
import { MemberModule } from "@/modules/management/member/member.module";
import { AuthModule } from "@/modules/management/auth/auth.module";

@Module({
	imports: [MemberModule, AccountModule, AuthModule],
	exports: [MemberModule, AccountModule, AuthModule],
})
export class ManagementModule {}
