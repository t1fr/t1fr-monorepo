import { Global, Module } from "@nestjs/common";
import { BotConfigCommand } from "@/modules/bot-config/bot-config.command";
import { BotConfigRepo } from "@/modules/bot-config/bot-config.repo";
import { PrismaService } from "@/prisma.service";

@Global()
@Module({
	providers: [BotConfigCommand, BotConfigRepo, PrismaService],
	exports: [BotConfigRepo],
})
export default class BotConfigModule {}
