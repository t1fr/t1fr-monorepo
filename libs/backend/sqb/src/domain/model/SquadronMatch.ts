import { Entity, EntityId } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import { InvalidSquadronMatchError } from "./DomainError";


export class SquadronMatchId extends EntityId<number[]> { }

type Player = {
    id: string;
    vehicle: string;
}

type SquadronMatchProps = {
    enemyName: string;
    isVictory: boolean | undefined;
    timestamp: Date;
    ourTeam: Player[],
    enemyTeam: Player[],
    battleRating: string;
}


export class SquadronMatch extends Entity<SquadronMatchId, SquadronMatchProps> {

    static create(id: SquadronMatchId, props: SquadronMatchProps) {
        const { ourTeam, enemyTeam } = props;
        if (ourTeam.length > 8) return Err(InvalidSquadronMatchError.create(`我方人數超過 8 人: ${ourTeam.length}`))
        if (enemyTeam.length > 8) return Err(InvalidSquadronMatchError.create(`敵方人數超過 8 人: ${enemyTeam.length}`))

        return Ok(new SquadronMatch(id, props))
    }

    static rebuild(id: SquadronMatchId, props: SquadronMatchProps) {
        return new SquadronMatch(id, props)
    }

    calcuateSimilarity(b: SquadronMatch) {
        const leftTimeseries = this.id.value;
        const rightTimeseries = b.id.value;
        const leftTimeseriesLength = leftTimeseries.length;
        const rightTimeseriesLength = rightTimeseries.length;

        const dp = new Array(rightTimeseriesLength + 1).fill(0);
        let maxm = 0;

        for (let i = leftTimeseriesLength - 1; i >= 0; i--) {
            let prev = 0;
            for (let j = rightTimeseriesLength - 1; j >= 0; j--) {
                const temp = dp[j];
                if (leftTimeseries[i] == rightTimeseries[j]) {
                    dp[j] = prev + 1;
                    maxm = Math.max(maxm, dp[j]);
                } else {
                    dp[j] = 0;
                }
                prev = temp;
            }
        }

        return maxm * 100 / rightTimeseriesLength;
    }

    toObject() {
        const { enemyName, timestamp, battleRating, ourTeam, enemyTeam, isVictory, } = this.props;
        return {
            enemyName,
            timestamp,
            battleRating,
            ourTeam: ourTeam.map(it => ({ ...it })),
            enemyTeam: enemyTeam.map(it => ({ ...it })),
            isVictory
        }
    }
}