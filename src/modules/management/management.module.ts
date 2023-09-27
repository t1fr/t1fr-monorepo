import { Module } from "@nestjs/common";
import { DiscordListenerService } from "./member/listener.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountModelDef } from "@/modules/management/account/account.schema";
import { MemberModelDef } from "@/modules/management/member/member.schema";
import { PointEventModelDef } from "@/modules/management/point/point.schema";
import { AccountRepo } from "@/modules/management/account/account.repo";
import { AccountCommand } from "@/modules/management/account/account.command";
import { MyAutocompleteInterceptor } from "@/modules/management/account/account.autocomplete";
import { AccountService } from "@/modules/management/account/account.service";
import { AccountController } from "@/modules/management/account/account.controller";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { MemberCommand } from "@/modules/management/member/member.command";
import { MemberUserCommand } from "@/modules/management/member/member.user.command";
import { MemberService } from "@/modules/management/member/member.service";
import { ConnectionName } from "@/constant";
import { RewardService } from "@/modules/management/point/reward.service";
import { PointRepo } from "@/modules/management/point/point.repo";
import { CalculateStage, stages } from "@/modules/management/point/stages/stage";
import { MemberController } from "@/modules/management/member/member.controller";

@Module({
	imports: [MongooseModule.forFeature([AccountModelDef, MemberModelDef, PointEventModelDef], ConnectionName.Management)],
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

		RewardService,
		PointRepo,
		...stages,
		{ provide: "stages", useFactory: (...stages: CalculateStage[]) => stages, inject: stages },
	],
	controllers: [AccountController, MemberController],
})
export class ManagementModule {}
