import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AccountRepo } from "@/modules/management/account/account.repo";
import { RewardService } from "@/modules/management/point/reward.service";
import { groupBy } from "lodash";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AccountType } from "@/modules/management/account/account.schema";

@Injectable()
export class AccountService implements OnModuleInit {
	private readonly logger = new Logger(AccountService.name);

	constructor(
		private readonly accountRepo: AccountRepo,
		private readonly rewardPointService: RewardService,
	) {}

	@Cron(CronExpression.EVERY_4_HOURS)
	sync() {
		return this.accountRepo.sync();
	}

	setAccountOwner(accountId: string, discordId: string) {
		return this.accountRepo.update(accountId, { owner: discordId });
	}

	async autolink() {
		return this.accountRepo.joinOnId();
	}

	setAccountType(accountId: string, accountType: AccountType) {
		return this.accountRepo.update(accountId, { type: accountType });
	}

	async calculateRewardPoint(isSimulate: boolean, verbose: boolean) {
		const results = await this.rewardPointService.calculate(await this.accountRepo.find({ isExist: true }));

		const groups = groupBy(
			results.filter((result) => result.point > 0),
			(result) => result.owner,
		);

		const messages = [];

		let totalPoints = 0;
		for (const groupsKey in groups) {
			totalPoints += groups[groupsKey].reduce((acc, cur) => acc + cur.point, 0);
			const accounts = groups[groupsKey];
			const accountDetails = accounts.map((calculateResult) => {
				const temp = [`* ${calculateResult.id}：${calculateResult.point} 積分${verbose ? " 原因" : ""}`];
				if (verbose) temp.push(...calculateResult.reasons.map((reason) => ` * ${reason}`));
				return temp;
			});

			messages.push([`<@${groupsKey}>`, ...accountDetails].join("\n"));
		}

		messages.push(`本賽季結算發放總量：${totalPoints}`);

		if (!isSimulate) {
			await this.rewardPointService.append(results);
			messages.unshift("已記錄完畢");
		}

		return messages;
	}

	async onModuleInit() {
		await this.accountRepo.sync();
		this.logger.log("更新聯隊內帳號資料完畢");
	}
}