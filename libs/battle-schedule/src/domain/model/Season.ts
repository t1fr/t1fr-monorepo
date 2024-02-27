import { AggregateRoot } from "@app/shared/AggregateRoot";
import { Section } from "@app/battle-schedule/domain/model/Section";
import { EntityId } from "@app/shared/EntityId";
import { Squad } from "@app/battle-schedule/domain/model/Squad";

interface SeasonProps {
	sections: Section;
	top100: Squad[];
}

interface SeasonId {
	year: number;
	season: number;
}

export class Season extends AggregateRoot<EntityId<SeasonId>, SeasonProps> {

}