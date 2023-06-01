import { Module } from "@nestjs/common";
import { SetScheduleCommand } from "@/modules/schedule/schedule.command";
import { SectionRepo } from "@/modules/schedule/section.repo";
import { PrismaService } from "@/prisma.service";

@Module({
	providers: [SetScheduleCommand, SectionRepo, PrismaService],
})
export default class ScheduleModule {}
