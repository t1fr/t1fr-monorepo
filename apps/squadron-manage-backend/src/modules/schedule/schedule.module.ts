import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";
import { ManagementModule } from "../management";
import { GithubModule } from "../github/github.module";
import { SeasonModelDef } from "./season.schema";
import { ConnectionName } from "../../constant";

@Module({
	imports: [ManagementModule, GithubModule, MongooseModule.forFeature([SeasonModelDef], ConnectionName.Management)],
	providers: [ScheduleService],
	exports: [ScheduleService],
	controllers: [ScheduleController],
})
export class BattleScheduleModule {
}
