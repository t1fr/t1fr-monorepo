import {Module} from "@nestjs/common";
import {MemberService} from "@/modules/management/member/member.service";
import {MongooseModule} from "@nestjs/mongoose";
import {ConnectionName} from "@/constant";
import {MemberController} from "@/modules/management/member/member.controller";
import {MemberModelDef} from "@/modules/management/member/member.schema";
import {StatisticModelDef} from "@/modules/management/member/statistic.schema";
import {GithubModule} from "@/modules/github/github.module";
import {UpdateDiscordRole} from "@/modules/management/member/member.event";
import {MemberChangeCommandHandler} from "@/modules/management/member/member.command";

@Module({
    imports: [GithubModule, MongooseModule.forFeature([MemberModelDef, StatisticModelDef], ConnectionName.Management)],
    providers: [MemberService, UpdateDiscordRole, MemberChangeCommandHandler],
    exports: [MemberService],
    controllers: [MemberController],
})
export class MemberModule {
}