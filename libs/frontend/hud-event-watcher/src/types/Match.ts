import dayjs from "dayjs";
import { partition, zipWith } from "lodash-es";
import { Err, Ok, type Result } from "ts-results-es";
import type { DamageEvent, HudMessage } from "./HudMessage";
import { parseDamageMessage } from "./parser";
import type { Player } from "./Player";

export class Match {

    private static IgnoreVehicles = new Set([
        "微型无人侦察机",
        "Recon Micro",
        "微型無人偵察機"
    ])

    private static groupDamageByMatch(events: DamageEvent[]): DamageEvent[][] {
        return events.reduce((acc, cur) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const lastGroup = acc.at(-1)!
            const lastDamageOfLastGroup = lastGroup.at(-1);
            if (!lastDamageOfLastGroup) lastGroup.push(cur)
            else if (lastDamageOfLastGroup.time > cur.time) acc.push([cur])
            else lastGroup.push(cur)
            return acc;
        }, [[]] as DamageEvent[][])
    }


    private static groupedDamageToMatch(events: DamageEvent[]): Result<Match, "非聯隊戰"> {
        const players = events
            .map(it => parseDamageMessage(it.msg))
            .filter((player): player is Player => player !== null && !this.IgnoreVehicles.has(player.vehicle))

        const squadronsInMatch = new Set<string | null>()

        players.forEach(player => squadronsInMatch.add(player.squadron))

        if (squadronsInMatch.has(null) || squadronsInMatch.size > 2) return Err("非聯隊戰");

        const [t1frers, enemies] = partition(players, it => it.squadron === "T1FR")

        return Ok(new Match(
            events[0].id,
            events[events.length - 1].id,
            events.map(it => it.time),
            enemies.at(0)?.squadron as string | undefined,
            new Map(t1frers.map(it => [it.id, it.vehicle])),
            new Map(enemies.map(it => [it.id, it.vehicle])),
        ))
    }

    static parse({ damage }: HudMessage): Match[] {
        if (damage.length === 0) return [];
        return this.groupDamageByMatch(damage)
            .map(events => this.groupedDamageToMatch(events))
            .filter(result => result.isOk())
            .map(result => result.value)
    }

    readonly playerList: Array<{
        our?: { id: string, vehicle: string },
        enemy?: { id: string, vehicle: string }
    }>

    readonly startTime: string;

    get isCompleted(): boolean {
        return this.ourTeam.size === 8 && this.enemyTeam.size === 8 && this.isVictory !== undefined;
    }


    private constructor(
        readonly firstId: number,
        readonly lastId: number,
        readonly timeSeries: number[],
        readonly enemyName: string | undefined,
        readonly ourTeam: Map<string, string>,
        readonly enemyTeam: Map<string, string>,
        readonly timestamp = new Date(),
        public isVictory: boolean | undefined = undefined
    ) {

        this.playerList = zipWith(
            Array.from(this.ourTeam.entries()).map(([id, vehicle]) => ({ id, vehicle })),
            Array.from(this.enemyTeam.entries()).map(([id, vehicle]) => ({ id, vehicle })),
            (a, b) => ({ our: a, enemy: b })
        )

        this.startTime = dayjs(timestamp).format("YYYY 年 MM 月 DD 日 HH:mm")
    }


    merge(other: Match) {
        return new Match(
            Math.min(this.firstId, other.firstId),
            Math.max(this.lastId, other.lastId),
            this.timeSeries.concat(other.timeSeries),
            other.enemyName ?? this.enemyName,
            new Map([...this.ourTeam, ...other.ourTeam]),
            new Map([...this.enemyTeam, ...other.enemyTeam]),
            this.timestamp,
            other.isVictory ?? this.isVictory
        )
    }
}