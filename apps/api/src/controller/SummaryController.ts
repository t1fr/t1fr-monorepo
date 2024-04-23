import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { PointService } from "@t1fr/legacy/management";
import { User } from "../decorator";
import { JwtGuard, OfficerGuard } from "../guard";

@Controller("members")
export class SummaryController {
  constructor(private readonly pointService: PointService) {
  }

  @UseGuards(JwtGuard)
  @Get("me/summary")
  async getSelfSummary(@User("_id") id: string) {
    return await this.pointService.summary(id);
  }

  @UseGuards(JwtGuard, OfficerGuard)
  @Get(":memberId/summary")
  async getMemberSummary(@Param("memberId") id: string) {
    return await this.pointService.summary(id);
  }
}
