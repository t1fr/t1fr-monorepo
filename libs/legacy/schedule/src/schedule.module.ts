import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";
import { GithubModule } from "@t1fr/backend/backup";
import { SeasonModelDef } from "./season.schema";
import { ConnectionName } from "./constant";

@Module({
    imports: [GithubModule, MongooseModule.forFeature([SeasonModelDef], ConnectionName.Management)],
    providers: [ScheduleService],
    exports: [ScheduleService,],
    controllers: [ScheduleController],
})
export class BattleScheduleModule {
}
