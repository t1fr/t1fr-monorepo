import { Module } from "@nestjs/common";
import { BattleScheduleService } from "./battle-schedule.service";

@Module({
	providers: [BattleScheduleService],
	exports: [BattleScheduleService],
})
export class BattleScheduleModule {}
