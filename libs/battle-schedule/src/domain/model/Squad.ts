import { ValueObject } from "@app/shared/ValueObject";
import { Performance } from "@app/battle-schedule/domain/model/Performance";

interface SquadProps {
	position: number;

	tag: string;

	point: number;

	performance: Performance;
}

export class Squad extends ValueObject<SquadProps> {
}