import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class BotConfigRepo {
	private readonly logger: Logger = new Logger(BotConfigRepo.name);

	constructor(private prisma: PrismaService) {}

	public async getValue(key: string) {
		return (await this.prisma.config.findFirst({ where: { key: key } }))?.value ?? "";
	}
}
