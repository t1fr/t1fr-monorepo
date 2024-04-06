import { Performance } from "./Performance";
import { ValueObject } from "@lib/ddd-types";
import { Ok } from "ts-results-es";

export interface SquadProps {
	id: number;

	position: number;

	tag: string;

	point: number;

	performance: Performance;
}

export class Squad extends ValueObject<SquadProps> {
	static create(data: SquadProps) {
		return Ok(new Squad(data));
	}
}