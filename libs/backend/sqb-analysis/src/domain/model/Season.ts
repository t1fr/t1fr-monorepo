import { AggregateRoot, EntityId } from "@t1fr/backend/ddd-types";
import { Squad } from "./Squad";
import { Err, Ok } from "ts-results-es";


type SeasonIdValue = { year: number, season: number };

interface SeasonProps {
	top100: Squad[];
	finalPos: number | null;
}

export class SeasonId extends EntityId<SeasonIdValue> {
}

export class Season extends AggregateRoot<SeasonId, SeasonProps> {
	private static readonly t1frSquadId = 1078072;

	static create(id: SeasonId, props: Pick<SeasonProps, "top100">) {
		const t1fr = props.top100.find(it => it.props.id === Season.t1frSquadId);
		return Ok(new Season(id, { ...props, finalPos: t1fr?.props.position ?? null }));
	}

	static rebuild(id: SeasonId, props: SeasonProps) {
		return Ok(new Season(id, props));
	}

	get findPos() {
		return this.props.finalPos !== null;
	}

	searchPos(squads: Squad[]) {
		const t1fr = squads.find(it => it.props.id === Season.t1frSquadId);
		if (!t1fr) return Err("");
		this.props.finalPos = t1fr.props.position;
		return Ok.EMPTY;
	}
}