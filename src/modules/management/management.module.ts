import { Module } from "@nestjs/common";
import { DiscordListenerService } from "./member/listener.service";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountModelDef } from "@/modules/management/account/account.schema";
import { MemberModelDef } from "@/modules/management/member/member.schema";
import { AccountRepo } from "@/modules/management/account/account.repo";
import { AccountCommand } from "@/modules/management/account/account.command";
import { MyAutocompleteInterceptor } from "@/modules/management/account/account.autocomplete";
import { AccountService } from "@/modules/management/account/account.service";
import { AccountController } from "@/modules/management/account/account.controller";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { MemberCommand } from "@/modules/management/member/member.command";
import { MemberUserCommand } from "@/modules/management/member/member.user.command";
import { MemberService } from "@/modules/management/member/member.service";
import PointModule from "@/modules/management/point/point.module";

@Module({
	imports: [HttpModule, MongooseModule.forFeature([AccountModelDef, MemberModelDef]), PointModule],
	providers: [
		DiscordListenerService,
		MyAutocompleteInterceptor,

		MemberRepo,
		MemberCommand,
		MemberUserCommand,
		MemberService,

		AccountRepo,
		AccountCommand,
		AccountService,
	],
	controllers: [AccountController],
})
export class ManagementModule {}
