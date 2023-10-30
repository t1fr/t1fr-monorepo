import { Module } from "@nestjs/common";
import { ScheduleService } from "@/modules/schedule/schedule.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SeasonModelDef } from "@/modules/schedule/season.schema";
import { ConnectionName } from "@/constant";
import { ManagementModule } from "@/modules/management/management.module";
import { GithubModule } from "@/modules/github/github.module";

@Module({
	imports: [ManagementModule, GithubModule, MongooseModule.forFeature([SeasonModelDef], ConnectionName.Management)],
	providers: [ScheduleService],
	exports: [ScheduleService],
})
export class BattleScheduleModule {}
