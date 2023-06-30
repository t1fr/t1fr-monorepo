import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { BotConfigRepo } from "@/modules/bot-config/bot-config.repo";
import { PrismaService } from "@/prisma.service";
import { Prisma } from "@prisma/client";
import { HttpService } from "@nestjs/axios";
import * as Cheerio from "cheerio";
import * as moment from "moment";

@Injectable()
export class AccountRepo {
	private readonly logger: Logger = new Logger(AccountRepo.name);

	private cache: { num: number; id: string }[] = [];

	constructor(private dynamicConfig: BotConfigRepo, private prisma: PrismaService, private httpService: HttpService) {}

	private get squadAccountListUrl() {
		return this.dynamicConfig.getValue("crawler.urls.squad_account_list");
	}

	private async getHtml(url: string): Promise<string | null> {
		let data: string | null = null;
		try {
			const response = await this.httpService.axiosRef.get(url);
			data = response.data;
		} catch (e) {
			this.logger.error(e);
		}
		return data;
	}

	public async fetchFromWeb(isInitialize: boolean = false) {
		const html = await this.getHtml(await this.squadAccountListUrl);
		if (!html) return;

		const $ = Cheerio.load(html);
		const columnsCount = 6;
		const cellValues = $(".squadrons-members__grid-item")
			.slice(columnsCount)
			.toArray()
			.map((element, index) => (index % 6 === 1 ? $(element).children("a").attr("href")?.trim() ?? "未知" : $(element).text().trim()));

		const inputs: Prisma.GameAccountCreateInput[] = [];
		for (let i = 0; i < cellValues.length; i += columnsCount) {
			const row = cellValues.slice(i, i + columnsCount);
			inputs.push({
				id: `${row[1]}@`.match(/(?<==)(.*?)(?=@)/)?.[0] ?? "",
				personalRating: parseInt(row[2]),
				activity: parseInt(row[3]),
				joinDate: moment(row[5], "DD.MM.YYYY").toDate(),
				title: row[4],
			});
		}

		if (isInitialize) {
			return (await Promise.all(inputs.map((input) => this.upsert(input)))).length;
		} else {
			let updates = 0;
			for (let input of inputs) {
				try {
					await this.update({ id: input.id }, input);
					updates++;
				} catch (e) {
					this.logger.error(e);
				}
			}
			return updates;
		}
	}

	async upsert(data: Prisma.GameAccountCreateInput) {
		return this.prisma.gameAccount.upsert({
			where: { id: data.id },
			update: { personalRating: data.personalRating, activity: data.activity, title: data.title },
			create: data,
		});
	}

	public async update(where: Prisma.GameAccountWhereUniqueInput, data: Prisma.GameAccountUpdateInput) {
		return this.prisma.gameAccount.update({ data: data, where: where });
	}

	public selectAllNumAndId() {
		return this.prisma.gameAccount.findMany({ select: { num: true, id: true } });
	}

	async joinOnId() {
		return this.prisma.$queryRaw<OwnershipData[]>`SELECT ga.num, ga.id AS account_id, ga.account_type, m.discord_id AS member_id, m.member_type
                                                      FROM game_accounts ga
                                                               LEFT JOIN members m ON m.nickname LIKE '%' || ga.id
                                                      WHERE ga.account_type IS NULL `;
	}

	async accounts(select: Prisma.GameAccountSelect) {
		return this.prisma.gameAccount.findMany({ select, where: { isExist: true } });
	}
}

export interface OwnershipData {
	num: number;
	account_id: string;
	member_id: string | null;
	member_type: number | null;
}
