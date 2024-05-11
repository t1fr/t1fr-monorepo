import type { ActionResult } from "@t1fr/backend/ddd-types";
import { groupBy, mapValues } from "lodash-es";
import { Ok } from "ts-results-es";
import { MemberType, PointLog, PointType, type Member } from "../../model";
import { AccountTypeStage } from "./AccountTypeStage";
import { BudgetStage } from "./BudgetStage";
import { RatingStage } from "./RatingStage";
import type { StageData } from "./stage";


export class RewardPointCalculateService {

    private readonly stages = [
        new RatingStage(),
        new AccountTypeStage(),
        new BudgetStage()
    ]

    calculate(members: Member[]): ActionResult<Record<string, PointLog[]>> {

        const calculateData = new Array<StageData>()

        for (const member of members) {
            if (member.isSponsor) continue;
            if (member.type === MemberType.Relaxer) continue;
            calculateData.push(...member.accounts.map(account => {
                if (account.type === null) throw Error(`${account.id.value} 帳號類型未設置`)
                return {
                    id: account.id.value,
                    ownerId: member.id.value,
                    point: 0,
                    reason: [],
                    personalRating: account.personalRating,
                    type: account.type
                }
            }))
        }

        const result = this.stages.reduce((stageData, currentStage) => currentStage.calculate(stageData), calculateData)

        return Ok(mapValues(
            groupBy(result, it => it.ownerId),
            data => data.map(it => PointLog.create({
                type: PointType.Reward,
                delta: it.point,
                comment: it.reason.join("；"),
                category: "賽季結算"
            }).value)
        ))
    }
}