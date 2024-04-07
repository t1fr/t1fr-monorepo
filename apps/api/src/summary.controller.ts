import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtGuard, OfficerGuard } from "./guards";
import { PointService } from "@t1fr/legacy/management";
import { User } from "./decorators";

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
