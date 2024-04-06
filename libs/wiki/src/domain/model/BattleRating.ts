import { ValueObject } from "@lib/ddd-types";
import { Ok } from "ts-results-es";

interface BattleRatingProps {
	arcade: number;
	realistic: number;
	simulator: number;
}

export class BattleRating extends ValueObject<BattleRatingProps> {
	static create(props: BattleRatingProps) {
		return Ok(new BattleRating(props));
	}
}

