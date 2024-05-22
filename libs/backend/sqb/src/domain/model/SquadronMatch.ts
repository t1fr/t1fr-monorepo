import { Entity, EntityId } from "@t1fr/backend/ddd-types";
import { uniqBy } from "lodash-es";
import { Err, Ok } from "ts-results-es";
import { v4 } from "uuid";
import { InvalidSquadronMatchError } from "./DomainError";


export class SquadronMatchId extends EntityId<string> {
    constructor(value: string = v4()) {
        super(value)
    }
}

type Player = {
    id: string;
    vehicle: string;
}

type SquadronMatchProps = {
    enemyName: string;
    timeSeries: number[]
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

    merge(match: SquadronMatch): SquadronMatch {
        const timeSeries = match.props.timeSeries.length > this.props.timeSeries.length ? match.props.timeSeries : this.props.timeSeries;
        const enemyTeam = uniqBy([...match.props.enemyTeam, ...this.props.enemyTeam], it => it.id)
        const ourTeam = uniqBy([...match.props.ourTeam, ...this.props.ourTeam], it => it.id)
        return new SquadronMatch(this.id, {
            timeSeries,
            enemyName: this.props.enemyName,
            ourTeam,
            enemyTeam,
            isVictory: this.props.isVictory ?? match.props.isVictory,
            timestamp: this.props.timestamp,
            battleRating: this.props.battleRating
        })
    }

    calcuateSimilarity(b: SquadronMatch) {
        const leftTimeseries = this.props.timeSeries;
        const rightTimeseries = b.props.timeSeries;
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
        const { timeSeries, enemyName, timestamp, battleRating, ourTeam, enemyTeam, isVictory, } = this.props;
        return {
            timeSeries,
            enemyName,
            timestamp,
            battleRating,
            ourTeam: ourTeam.map(it => ({ ...it })),
            enemyTeam: enemyTeam.map(it => ({ ...it })),
            isVictory
        }
    }
}