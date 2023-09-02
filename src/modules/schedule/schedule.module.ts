import { Module } from "@nestjs/common";
import { SetScheduleCommand } from "@/modules/schedule/schedule.command";
import { SeasonRepo } from "@/modules/schedule/season.repo";
import { ScheduleService } from "@/modules/schedule/schedule.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SeasonModelDef } from "@/modules/schedule/season.schema";

@Module({
	imports: [MongooseModule.forFeature([SeasonModelDef])],
	providers: [SetScheduleCommand, SeasonRepo, ScheduleService],
})
export default class ScheduleModule {}
