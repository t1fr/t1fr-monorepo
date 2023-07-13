import { Injectable, Logger } from "@nestjs/common";
import { AccountRepo } from "@/modules/squadron/account/account.repo";
import { RewardService } from "@/modules/point/reward/reward.service";
import { AccountType } from "@/modules/squadron/account/account-type.enum";
import { AccountSeasonResult } from "@/modules/point/reward/account-season-result.model";
import { groupBy } from "lodash";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Client } from "discord.js";

@Injectable()
export class AccountService {
	private readonly logger = new Logger(AccountService.name);

	constructor(private readonly accountRepo: AccountRepo, private readonly rewardPointService: RewardService, private readonly client: Client) {}

	@Cron(CronExpression.EVERY_4_HOURS)
	fetchAccounts() {
		return this.accountRepo.fetchFromWeb();
	}

	setAccountOwner(accountNum: number, discordId: string) {
		return this.accountRepo.update({ num: accountNum }, { owner: { connect: { discordId: discordId } } });
	}

	setAccountType(accountNum: number, accountType: AccountType) {
		return this.accountRepo.update({ num: accountNum }, { accountType: accountType });
	}

	async linkAccountAndMember() {
		const ownershipData = await this.accountRepo.joinOnId();
		// 只有找得到連結且帳號類型未知的才更新
		const unlinkableIds = ownershipData.filter((ownership) => ownership.member_id === null).map((ownership) => ownership.account_id);

		let successCount = 0;

		for (const ownership of ownershipData.filter((ownership) => ownership.member_id !== null)) {
			await this.accountRepo
				.update(
					{ num: ownership.num },
					{
						owner: { connect: { discordId: ownership.member_id! } },
						accountType: AccountType.MAIN_CORE,
					},
				)
				.catch(this.logger.error);
			successCount++;
		}

		return {
			linkableCount: ownershipData.length - unlinkableIds.length,
			successCount: successCount,
			failedCount: ownershipData.length - unlinkableIds.length - successCount,
			unlinkableIds: unlinkableIds,
		};
	}

	async calculateRewardPoint(isSimulate: boolean, verbose: boolean) {
		const accounts = (await this.accountRepo.accounts({
			id: true,
			accountType: true,
			personalRating: true,
			memberId: true,
		})) as AccountSeasonResult[];

		if (accounts.some((account) => account.memberId === null || account.accountType === null)) {
			return ["有帳號未設置帳號類型或所有者，計算取消"];
		}

		const results = this.rewardPointService.calculate(accounts);

		const groups = groupBy(
			results.filter((result) => result.point > 0),
			(result) => result.memberId,
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
			const promises = results
				.filter((result) => result.point > 0)
				.map((result) => this.rewardPointService.append(result.memberId, result.point, [`因 ${result.id}`, ...result.reasons].join("\n")));
			await Promise.all(promises);

			messages.unshift("已記錄完畢");
		}

		return messages;
	}
}
