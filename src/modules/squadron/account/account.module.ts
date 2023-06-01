import { Module } from "@nestjs/common";
import { AccountRepo } from "@/modules/squadron/account/account.repo";
import { PrismaService } from "@/prisma.service";
import RewardModule from "@/modules/point/reward/reward.module";
import { AccountController } from "@/modules/squadron/account/account.controller";
import { AccountCommand } from "@/modules/squadron/account/account.command";
import { AccountAutocompleteInterceptor } from "@/modules/squadron/account/account.autocomplete";
import MemberModule from "@/modules/squadron/member/member.module";

@Module({
	imports: [RewardModule, MemberModule],
	providers: [PrismaService, AccountRepo, AccountCommand, AccountAutocompleteInterceptor],
	exports: [AccountRepo],
	controllers: [AccountController],
})
export default class AccountModule {}
