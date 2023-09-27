import { Controller, Get } from "@nestjs/common";
import { MemberService } from "@/modules/management/member/member.service";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { PointRepo } from "@/modules/management/point/point.repo";

@Controller("members")
export class MemberController {
	constructor(private memberRepo: MemberRepo) {}

	@Get()
	async getMembers() {
		return await this.memberRepo.list();
	}
}