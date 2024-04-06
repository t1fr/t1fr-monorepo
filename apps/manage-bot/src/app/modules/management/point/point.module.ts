import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GithubModule } from "../../github/github.module";
import { SummaryModelDef } from "./summary.schema";
import { PointService } from "./point.service";
import { AbsenceService } from "./subservice/absense.service";
import { CalculateStage, stages } from "./stages/stage";
import { RewardService } from "./subservice/reward.service";
import { PointEventModelDef } from "./point.schema";
import { AccountSnapshotModelDef } from "./account.snapshot.schema";
import { ConnectionName } from "../../../constant";
import { SummaryController } from "./summary.controller";
import { PointLogController } from "./point.controller";

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
	controllers: [SummaryController, PointLogController],
})
export default class PointModule {}