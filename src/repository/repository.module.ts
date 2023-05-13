import { Global, Module } from '@nestjs/common';
import { MemberRepo } from './member.repo';
import { AccountRepo } from './account.repo';
import { SectionRepo } from './section.repo';
import { PrismaService } from '../prisma.service';
import { ConfigRepo } from './config.repo';

@Global()
@Module({
  providers: [MemberRepo, AccountRepo, SectionRepo, ConfigRepo, PrismaService],
  exports: [MemberRepo, AccountRepo, SectionRepo, ConfigRepo],
})

export class RepositoryModule {
}