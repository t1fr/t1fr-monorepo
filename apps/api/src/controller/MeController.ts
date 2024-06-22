import { Controller, Get, NotFoundException, Session, UnauthorizedException, UseGuards } from "@nestjs/common";
import { MemberQueryRepo } from "@t1fr/backend/member-manage";
import { SessionGuard } from "../guard";

@Controller("me")
@UseGuards(SessionGuard)
export class MeController {

    @MemberQueryRepo()
    private readonly memberRepo!: MemberQueryRepo;


    @Get("summary")
    async getSelfSummary(@Session() { id }: CookieSessionInterfaces.CookieSessionObject) {
        return this.memberRepo.getMemberDetail(id).orElse(error => { throw new NotFoundException(error); }).promise;
    }

    @Get('info')
    async getSelfInfo(@Session() { id }: CookieSessionInterfaces.CookieSessionObject) {
        const info = await this.memberRepo.findExistMemberInfo(id)
        if (info === null) throw new UnauthorizedException(`無法尋找到您的隊員紀錄`);
        return info;
    }
}