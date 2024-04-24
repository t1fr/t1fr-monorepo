import { Controller } from "@nestjs/common";

@Controller("members")
export class SummaryController {
    // @UseGuards(JwtGuard)
    // @Get("me/summary")
    // async getSelfSummary(@UserToken("_id") id: string) {
    //   return await this.pointService.summary(id);
    // }
    //
    // @UseGuards(JwtGuard, OfficerGuard)
    // @Get(":memberId/summary")
    // async getMemberSummary(@Param("memberId") id: string) {
    //   return await this.pointService.summary(id);
    // }
}
