import { Module } from "@nestjs/common";
import { AccountRepo } from "@/modules/squadron/account/account.repo";
import { PrismaService } from "@/prisma.service";
import RewardModule from "@/modules/point/reward/reward.module";
import { AccountController } from "@/modules/squadron/account/account.controller";
import { AccountCommand } from "@/modules/squadron/account/bot/account.command";
import { AccountAutocompleteInterceptor } from "@/modules/squadron/account/bot/account.autocomplete";
import MemberModule from "@/modules/squadron/member/member.module";
import { AccountService } from "@/modules/squadron/account/account.service";

@Module({
	imports: [RewardModule, MemberModule],
	providers: [PrismaService, AccountRepo, AccountCommand, AccountAutocompleteInterceptor, AccountService],
	exports: [AccountRepo],
	controllers: [AccountController],
})
export default class AccountModule {}
