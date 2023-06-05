import { Module } from "@nestjs/common";
import { SetScheduleCommand } from "@/modules/battle-schedule/schedule.command";
import { SectionRepo } from "@/modules/battle-schedule/section.repo";
import { PrismaService } from "@/prisma.service";
@Module({
	providers: [SetScheduleCommand, SectionRepo, PrismaService],
})
export default class BattleScheduleModule {}
