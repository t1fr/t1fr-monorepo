import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { ListExistMemberDTO, MemberQueryRepo } from "@t1fr/backend/member-manage";
import { JwtGuard, OfficerGuard } from "../guard";

@Controller("members")
export class MemberController {
    @MemberQueryRepo()
    private readonly memberRepo!: MemberQueryRepo;

    @ApiResponse({ description: "回傳目前隊員 DC 帳號與相關點數統計", type: ListExistMemberDTO, isArray: true })
    @UseGuards(JwtGuard, OfficerGuard)
    @Get()
    async getMembers() {
        return await this.memberRepo.listExistMember();
    }
}
