import { Module } from "@nestjs/common";
import { ScheduleService } from "@/modules/schedule/schedule.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SeasonModelDef } from "@/modules/schedule/season.schema";
import { ConnectionName } from "@/constant";

@Module({
	imports: [MongooseModule.forFeature([SeasonModelDef], ConnectionName.Management)],
	providers: [ScheduleService],
	exports: [ScheduleService],
})
export class BattleScheduleModule {}