import { BadRequestException, Body, Controller, Post, Query, UseGuards } from "@nestjs/common";
import { JwtGuard, OfficerGuard } from "./guards";
import { PageParam, PointService, PointType, PointTypes } from "@t1fr/legacy/management";

@Controller("point-logs")
@UseGuards(JwtGuard, OfficerGuard)
export class PointLogController {
  constructor(private readonly pointService: PointService) {
  }

  @Post()
  async getLogs(@Query("type") type: PointType, @Body() param: PageParam) {
    if (!type) throw new BadRequestException(`type 需為 ${PointTypes} 之一`);
    return await this.pointService.fetch(type, param);
  }
}
