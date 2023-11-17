import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { JwtGuard, OfficerGuard } from "@/guards";
import { PageParam, PointService } from "@/modules/management/point/point.service";
import { PointType, PointTypes } from "@/modules/management/point/point.schema";

@Controller("point-logs")
@UseGuards(JwtGuard, OfficerGuard)
export class PointLogController {
	constructor(private readonly pointService: PointService) {}

	@Post()
	async getLogs(@Query("type") type: PointType, @Body() param: PageParam) {
		if (!type) throw new BadRequestException(`type 需為 ${PointTypes} 之一`);
		return await this.pointService.fetch(type, param);
	}
}