import { BadRequestException, Body, Controller, Post, Query, UseGuards } from "@nestjs/common";
import { PageParam, PointService, PointType, PointTypes } from "@t1fr/legacy/management";
import { JwtGuard, OfficerGuard } from "../guard";

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
