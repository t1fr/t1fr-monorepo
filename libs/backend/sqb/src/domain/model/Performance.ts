import { ValueObject } from "@t1fr/backend/ddd-types";
import { Ok } from "ts-results-es";

interface PerformanceProps {
    groundKills: number;

    airKills: number;

    deaths: number;

    wins: number;

    battles: number;

    period: number;
}

export class Performance extends ValueObject<PerformanceProps> {
    static create(data: PerformanceProps) {
        return Ok(new Performance(data));
    }

    get winRate() {
        return this.props.wins / this.props.battles;
    }

    get KD() {
        return (this.props.airKills + this.props.groundKills) / this.props.deaths;
    }
}
