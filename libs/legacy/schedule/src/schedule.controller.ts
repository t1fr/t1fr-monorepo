import { BadRequestException, Controller, Get, NotImplementedException, Query } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";

@Controller("seasons")
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {
	}

	@Get("latest")
	async getCurrentSeason() {
		return this.scheduleService.getLatestSeason();
	}

	@Get()
	async getSeason(@Query("year") year?: string, @Query("season") season?: string) {
		if (!year || !season) throw new BadRequestException("參數 year, season 為必填");
		throw new NotImplementedException();
	}
}