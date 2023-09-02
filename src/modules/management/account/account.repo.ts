import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import * as Cheerio from "cheerio";
import { SquadronMemberListUrl } from "@/constant";
import { InjectModel } from "@nestjs/mongoose";
import { Account } from "@/modules/management/account/account.schema";
import { FilterQuery, Model } from "mongoose";
import dayjs from "dayjs";

@Injectable()
export class AccountRepo {
	private readonly logger: Logger = new Logger(AccountRepo.name);

	constructor(
		@InjectModel(Account.name) private readonly accountModel: Model<Account>,
		private httpService: HttpService,
	) {}

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

	public async fetchFromWeb() {
		const html = await this.getHtml(SquadronMemberListUrl);
		if (!html) return;

		const $ = Cheerio.load(html);
		const columnsCount = 6;
		const cellValues = $(".squadrons-members__grid-item")
			.slice(columnsCount)
			.toArray()
			.map((element, index) => (index % 6 === 1 ? $(element).children("a").attr("href")?.trim() ?? "未知" : $(element).text().trim()));

		const inputs: Account[] = [];
		for (let i = 0; i < cellValues.length; i += columnsCount) {
			const row = cellValues.slice(i, i + columnsCount);
			inputs.push({
				_id: `${row[1]}@`.match(/(?<==)(.*?)(?=@)/)?.[0] ?? "",
				personalRating: parseInt(row[2]),
				activity: parseInt(row[3]),
				joinDate: dayjs(row[5], "DD.MM.YYYY").toDate(),
				owner: null,
				type: null,
				isExist: true,
			});
		}

		await this.upsert(inputs);
	}

	async upsert(accounts: Account[]) {
		await this.accountModel.bulkWrite(
			accounts.map((account) => ({
				updateOne: { filter: { _id: account._id }, update: account, upsert: true },
			})),
		);
	}

	public async update(id: string, account: Partial<Omit<Account, "_id">>) {
		return this.accountModel.findByIdAndUpdate(id, account);
	}

	public async find(filter: FilterQuery<Account> = {}) {
		return this.accountModel.find(filter);
	}

	async joinOnId() {
		return;
	}
}
