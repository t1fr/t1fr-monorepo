import { Adapter } from "@t1fr/backend/ddd-types";
import { DomainError, Performance, Season, SeasonId, Squad } from "../domain";
import { PerformanceSchema, SeasonSchema, SquadSchema } from "./SeasonSchema";
import { Ok, Result } from "ts-results-es";

class PerformanceAdapter implements Adapter<Performance, PerformanceSchema, DomainError> {
	persist(model: Performance): Ok<PerformanceSchema> {
		return Ok(model.props);
	}

	restore(model: PerformanceSchema): Result<Performance, DomainError> {
		return Performance.create(model);
	}
}


class SquadAdapter implements Adapter<Squad, SquadSchema, DomainError> {

	static readonly performanceAdapter = new PerformanceAdapter();

	persist(model: Squad): Result<SquadSchema, DomainError> {
		return SquadAdapter.performanceAdapter
			.persist(model.props.performance)
			.andThen(performance => Ok({ ...model.props, performance }));
	}

	restore(model: SquadSchema): Result<Squad, DomainError> {
		return SquadAdapter.performanceAdapter
			.restore(model.performance)
			.andThen(performance => Squad.create({ ...model, performance }));
	}
}

export class SeasonAdapter implements Adapter<Season, SeasonSchema, DomainError> {
	static readonly squadAdapter = new SquadAdapter();

	persist(model: Season): Result<SeasonSchema, DomainError> {
		const { top100, finalPos } = model.toObject();
		const { year, season } = model.id.value;
		return Result.all(...top100.map(SeasonAdapter.squadAdapter.persist))
			.andThen(top100 => Ok({ year, season, top100, finalPos }));
	}

	restore(model: SeasonSchema): Result<Season, DomainError> {
		const id = new SeasonId({ year: model.year, season: model.season });
		return Result.all(...model.top100.map(SeasonAdapter.squadAdapter.restore))
			.andThen(top100 => Season.rebuild(id, { top100, finalPos: model.finalPos }));
	}
}
