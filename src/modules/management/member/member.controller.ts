import { Controller, Get } from "@nestjs/common";
import { MemberService } from "@/modules/management/member/member.service";
import { ApiResponse } from "@nestjs/swagger";

@Controller("members")
export class MemberController {
	constructor(private memberService: MemberService) {}

	@ApiResponse({ description: "回傳目前隊員 DC 帳號與相關點數統計" })
	@Get()
	async getMembers() {
		return await this.memberService.listMemberWithStatistic();
	}
}