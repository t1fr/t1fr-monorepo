import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { Member, Prisma } from "@prisma/client";

@Injectable()
export class MemberRepo  {
	constructor(private prisma: PrismaService) {}

	async upsert(data: Prisma.MemberCreateInput): Promise<Member> {
		return this.prisma.member.upsert({
			where: { discordId: data.discordId },
			update: data,
			create: data,
		});
	}

	async delete(where: Prisma.MemberWhereUniqueInput): Promise<Member> {
		return this.prisma.member.delete({ where });
	}

	async update(where: Prisma.MemberWhereUniqueInput, data: Prisma.MemberUpdateInput): Promise<Member> {
		return this.prisma.member.update({ data, where });
	}

	selectAllIdAndName() {
		return this.prisma.member.findMany({ select: { discordId: true, nickname: true } });
	}

}
