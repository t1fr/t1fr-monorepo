import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { MemberService } from "@t1fr/legacy/management";
import { JwtGuard, OfficerGuard } from "../guard";

@Controller("members")
export class MemberController {
  constructor(private memberService: MemberService) {
  }

  @ApiResponse({ description: "回傳目前隊員 DC 帳號與相關點數統計" })
  @UseGuards(JwtGuard, OfficerGuard)
  @Get()
  async getMembers() {
    return await this.memberService.listMemberWithStatistic();
  }
}
