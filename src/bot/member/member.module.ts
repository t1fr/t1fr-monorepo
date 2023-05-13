import { Module } from '@nestjs/common';
import { MemberCommand } from './member.command';
import { MemberUserCommand } from './member.user.command';
import PointModule from '../../points/point.module';

@Module({
  providers: [MemberCommand, MemberUserCommand],
  imports: [PointModule],
})

export class MemberModule {
}