import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MemberService } from "@/modules/management/member/member.service";
import { ApiResponse } from "@nestjs/swagger";
import { JwtGuard, OfficerGuard } from "@/guards";
import { User } from "@/decorators/user.decorator";

@Controller("members")
export class MemberController {
	constructor(private memberService: MemberService) {}

	@ApiResponse({ description: "回傳目前隊員 DC 帳號與相關點數統計" })
	@UseGuards(JwtGuard, OfficerGuard)
	@Get()
	async getMembers() {
		return await this.memberService.listMemberWithStatistic();
	}

	@UseGuards(JwtGuard)
	@Get("me/summary")
	async getSelfSummary(@User("_id") id: string) {
		return await this.memberService.summary(id);
	}

	@UseGuards(JwtGuard, OfficerGuard)
	@Get(":memberId/summary")
	async getMemberSummary(@Param("memberId") id: string) {
		return await this.memberService.summary(id);
	}
}