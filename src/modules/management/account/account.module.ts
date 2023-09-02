import { Module } from "@nestjs/common";
import { AccountRepo } from "@/modules/management/account/account.repo";
import { AccountController } from "@/modules/management/account/account.controller";
import { AccountCommand } from "@/modules/management/account/account.command";
import { AccountAutocompleteInterceptor } from "@/modules/management/account/account.autocomplete";
import MemberModule from "@/modules/management/member/member.module";
import { AccountService } from "@/modules/management/account/account.service";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [MemberModule, HttpModule],
	providers: [AccountRepo, AccountCommand, AccountAutocompleteInterceptor, AccountService],
	exports: [AccountRepo],
	controllers: [AccountController],
})
export default class AccountModule {}
