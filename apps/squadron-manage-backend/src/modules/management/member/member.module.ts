import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MemberChangeCommandHandler } from "./member.command";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { UpdateDiscordRole } from "./member.event";
import { GithubModule } from "../../github/github.module";
import { MemberModelDef } from "./member.schema";
import { StatisticModelDef } from "./statistic.schema";
import { ConnectionName } from "../../../constant";

@Module({
	imports: [GithubModule, MongooseModule.forFeature([MemberModelDef, StatisticModelDef], ConnectionName.Management)],
	providers: [MemberService, UpdateDiscordRole, MemberChangeCommandHandler],
	exports: [MemberService],
	controllers: [MemberController],
})
export class MemberModule {
}