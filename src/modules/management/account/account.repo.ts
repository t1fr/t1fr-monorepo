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

	public async sync() {
		const html = await this.getHtml(SquadronMemberListUrl);
		if (!html) return;

		const $ = Cheerio.load(html);
		const columnsCount = 6;
		const cellValues = $(".squadrons-members__grid-item")
			.slice(columnsCount)
			.toArray()
			.map((element, index) => (index % 6 === 1 ? $(element).children("a").attr("href")?.trim() ?? "未知" : $(element).text().trim()));

		const inputs: Partial<Account>[] = [];
		for (let i = 0; i < cellValues.length; i += columnsCount) {
			const row = cellValues.slice(i, i + columnsCount);
			inputs.push({
				_id: `${row[1]}@`.match(/(?<==)(.*?)(?=@)/)?.[0] ?? "",
				personalRating: parseInt(row[2]),
				activity: parseInt(row[3]),
				joinDate: dayjs(row[5], "DD.MM.YYYY").format("YYYY-MM-DD"),
				isExist: true,
			});
		}

		await this.accountModel.bulkWrite([
			{ updateMany: { filter: {}, update: { isExist: false } } },
			...inputs.map((account) => ({
				updateOne: { filter: { _id: account._id }, update: account, upsert: true },
			})),
		]);
	}

	public async update(id: string, account: Partial<Omit<Account, "_id">>) {
		return this.accountModel.findByIdAndUpdate(id, account);
	}

	public async find(filter: FilterQuery<Account> = {}, limit?: number) {
		const query = this.accountModel.find(filter);
		return limit ? query.limit(limit) : query;
	}

	public async listAllExistAccounts() {
		return this.accountModel.find({ isExist: true }).populate("owner");
	}

	async joinOnId() {
		const data: { _id: string; owner: string }[] = await this.accountModel.aggregate([
			{
				$lookup: {
					as: "member",
					from: "members",
					let: { id: "$_id" },
					pipeline: [{ $match: { $expr: { $eq: [{ $last: { $split: ["$nickname", "丨"] } }, "$$id"] } } }],
				},
			},
			{ $project: { owner: "$member._id" } },
			{ $unwind: "$owner" },
		]);

		const result = await this.accountModel.bulkWrite(data.map((value) => ({ updateOne: { filter: { _id: value._id }, update: { owner: value.owner } } })));

		return {
			linkable: data.length,
			modified: result.modifiedCount,
			errors: result.getWriteErrors().map((value) => value.errmsg ?? value.index.toString()),
		};
	}
}
