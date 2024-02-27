import { ValueObject } from "@app/shared/ValueObject";

interface PerformanceProps {
	groundKills: number;

	airKills: number;

	deaths: number;

	wins: number;

	battles: number;

	period: number;
}

export class Performance extends ValueObject<PerformanceProps> {
	get winRate() {
		return this.props.wins / this.props.battles;
	}

	get KD() {
		return (this.props.airKills + this.props.groundKills) / this.props.deaths;
	}
}