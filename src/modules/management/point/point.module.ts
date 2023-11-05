import { CalculateStage, stages } from "@/modules/management/point/stages/stage";
import { Module } from "@nestjs/common";
import { PointService } from "@/modules/management/point/point.service";
import { RewardService } from "@/modules/management/point/subservice/reward.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConnectionName } from "@/constant";
import { GithubModule } from "@/modules/github/github.module";
import { SummaryController } from "@/modules/management/point/summary.controller";
import { PointEventModelDef } from "@/modules/management/point/point.schema";
import { AccountSnapshotModelDef } from "@/modules/management/point/account.snapshot.schema";
import { SummaryModelDef } from "@/modules/management/point/summary.schema";
import { AbsenceService } from "@/modules/management/point/subservice/absense.service";

@Module({
	imports: [GithubModule, MongooseModule.forFeature([SummaryModelDef, PointEventModelDef, AccountSnapshotModelDef], ConnectionName.Management)],
	providers: [
		RewardService,
		PointService,
		AbsenceService,
		...stages,
		{ provide: "stages", useFactory: (...stages: CalculateStage[]) => stages, inject: stages },
	],
	exports: [PointService],
	controllers: [SummaryController],
})
export default class PointModule {}