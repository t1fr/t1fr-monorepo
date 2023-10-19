import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConnectionName, SquadronMemberListUrl } from "@/constant";
import { InjectModel } from "@nestjs/mongoose";
import { Account, AccountUpdateData } from "@/modules/management/account/account.schema";
import { Model } from "mongoose";
import dayjs from "dayjs";
import { lastValueFrom } from "rxjs";
import { Cron, CronExpression } from "@nestjs/schedule";
import * as Cheerio from "cheerio";
import { parseInt } from "lodash";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AccountService implements OnModuleInit {
	private readonly logger: Logger = new Logger(AccountService.name);

	constructor(
		@InjectModel(Account.name, ConnectionName.Management) private readonly accountModel: Model<Account>,
		private httpService: HttpService,
		private configService: ConfigService,
	) {}

	async onModuleInit() {
		await this.sync();
	}

	@Cron(CronExpression.EVERY_4_HOURS)
	public async sync() {
		const response = await lastValueFrom(this.httpService.get(SquadronMemberListUrl)).catch(this.logger.error);

		if (!response || !response.data) return;
		const $ = Cheerio.load(response.data);
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

		const result = await this.accountModel.bulkWrite([
			{ updateMany: { filter: {}, update: { isExist: false } } },
			...inputs.map(account => ({ updateOne: { filter: { _id: account._id }, update: account, upsert: true } })),
			{ deleteMany: { filter: { isExist: false } } },
		]);

		this.logger.log(["同步聯隊遊戲帳號完畢", `新增 ${result.insertedCount} 個帳號`, `刪除 ${result.deletedCount} 個帳號`].join("\n"));
	}

	async updateAccount(accountId: string, data: AccountUpdateData) {
		const account = await this.accountModel.findByIdAndUpdate(accountId, { $set: data }, { runValidators: true });
		return account ? Promise.resolve(account) : Promise.reject("查無帳號");
	}

	async findExistingAccount() {
		return this.accountModel.find({ isExist: true }, { isExist: false }, { populate: { path: "owner", select: ["_id", "nickname", "avatarUrl"] } });
	}

	async searchByIdContain(query: string) {
		return this.accountModel.find({ _id: { $regex: RegExp(query, "i") } }, { _id: true }, { limit: 25 }).exec();
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

		const result = await this.accountModel.bulkWrite(data.map(value => ({ updateOne: { filter: { _id: value._id }, update: { owner: value.owner } } })));

		return {
			linkable: data.length,
			modified: result.modifiedCount,
			errors: result.getWriteErrors().map(value => value.errmsg ?? value.index.toString()),
		};
	}

	@Cron("00 08,20 * * *", { utcOffset: 8 })
	async backup() {
		const accounts = await this.accountModel.find({}, { isExist: false });
		const keys: (keyof Account)[] = ["_id", "personalRating", "activity", "joinDate", "owner", "type"];
		const content = Buffer.from(
			`${keys.join(",")}\n${accounts
				.map(account => [account._id, account.personalRating, account.activity, account.joinDate, account.owner, account.type].join(","))
				.join("\n")}`,
		).toString("base64");
		const message = dayjs().format("YYYY-MM-DD HH:mm");
		const url = "https://api.github.com/repos/t1fr/data-backup/contents/account.csv";
		const token = this.configService.get("ACCESS_TOKEN");
		const headers = { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}` };
		let sha = undefined;
		const getResult = await this.httpService.axiosRef.get<{ sha: string }>(url, { headers }).catch(console.error);
		if (getResult) sha = getResult.data.sha;
		await this.httpService.axiosRef.put(url, { message, content, sha }, { headers }).catch(console.error);
	}
}
