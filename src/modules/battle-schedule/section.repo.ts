import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class SectionRepo {
	constructor(private prisma: PrismaService) {}

	public async upsert(data: Prisma.SectionCreateInput) {
		return this.prisma.section.upsert({
			where: { from: data.from },
			create: data,
			update: { battleRating: data.battleRating },
		});
	}

	public getCurrentSection() {
		const now = new Date();
		return this.prisma.section.findFirst({ where: { from: { lte: now }, to: { gte: now } } });
	}
}
