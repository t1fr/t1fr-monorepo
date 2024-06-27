import { Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { MemberQueryRepo } from "@t1fr/backend/member-manage";
import { OfficerGuard } from "../guard";

@Controller("members")
export class SummaryController {

    @MemberQueryRepo()
    private readonly memberRepo!: MemberQueryRepo;

    @UseGuards(OfficerGuard)
    @Get(":memberId/summary")
    getMemberSummary(@Param("memberId") id: string) {
        return this.memberRepo.getMemberDetail(id).orElse(error => { throw new NotFoundException(error); }).promise;
    }
}
