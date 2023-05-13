import { Module } from '@nestjs/common';
import { DiscordListenerService } from './listener.service';
import { SetScheduleService } from './schedule.service';
import { AccountModule } from './account/account.module';
import { MemberModule } from './member/member.module';
import PointModule from '../points/point.module';

@Module({
  imports: [AccountModule, MemberModule],
  providers: [
    DiscordListenerService,
    SetScheduleService,
  ],
})
export class DiscordBotModule {
}