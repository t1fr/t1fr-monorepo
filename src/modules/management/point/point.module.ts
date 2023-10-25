import { CalculateStage, stages } from "@/modules/management/point/stages/stage";
import { Module } from "@nestjs/common";
import { PointRepo } from '@/modules/management/point/point.repo'
import { RewardService } from '@/modules/management/point/reward.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ConnectionName } from '@/constant'
import { PointEventModelDef } from '@/modules/management/point/point.schema'
import { GithubModule } from '@/modules/github/github.module'

@Module({
	imports: [GithubModule, MongooseModule.forFeature([PointEventModelDef], ConnectionName.Management)],
	providers: [RewardService, PointRepo, ...stages, { provide: "stages", useFactory: (...stages: CalculateStage[]) => stages, inject: stages }],
})
export default class PointModule {}