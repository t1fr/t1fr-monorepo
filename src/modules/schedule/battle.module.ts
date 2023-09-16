import { Module } from "@nestjs/common";
import { SetScheduleCommand } from "@/modules/schedule/battle.command";
import { SeasonRepo } from "@/modules/schedule/season.repo";
import { BattleService } from "@/modules/schedule/battle.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SeasonModelDef } from "@/modules/schedule/season.schema";
import { ConnectionName } from "@/constant";

@Module({
	imports: [MongooseModule.forFeature([SeasonModelDef], ConnectionName.Management)],
	providers: [SetScheduleCommand, SeasonRepo, BattleService],
})
export default class BattleModule {}
