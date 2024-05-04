import { Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { MemberQueryRepo } from "@t1fr/backend/member-manage";
import { UserToken } from "../decorator";
import { JwtGuard, OfficerGuard } from "../guard";

@Controller("members")
export class SummaryController {

    @MemberQueryRepo()
    private readonly memberRepo!: MemberQueryRepo;

    private getMemberDetailOrThrow(id: string) {
        const result = this.memberRepo.getMemberDetail(id);
        return result.orElse(error => {
            throw new NotFoundException(error);
        }).promise;
    }

    @UseGuards(JwtGuard)
    @Get("me/summary")
    async getSelfSummary(@UserToken("id") id: string) {
        return this.getMemberDetailOrThrow(id);
    }

    @UseGuards(JwtGuard, OfficerGuard)
    @Get(":memberId/summary")
    async getMemberSummary(@Param("memberId") id: string) {
        return this.getMemberDetailOrThrow(id);
    }
}
