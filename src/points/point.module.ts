import { Module } from '@nestjs/common';
import { RewardPointService } from './reward-point.service';

@Module({
  exports: [RewardPointService],
  providers: [RewardPointService]
})

export default class PointModule {
}