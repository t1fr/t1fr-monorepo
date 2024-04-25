import { AggregateRoot, EntityId } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import { Section } from "./Section";

interface SeasonProps {
    sections: Section[];
}

type SeasonIdValue = { year: number, season: number };

export class SeasonId extends EntityId<SeasonIdValue> {
    override equals(entityId: EntityId<SeasonIdValue>): boolean {
        return this.value.year === entityId.value.year && this.value.season === entityId.value.season;
    }
}

export class Season extends AggregateRoot<SeasonId, SeasonProps> {
    static create(year: number, sections: Section[]) {
        const seasons = sections.map(section => section.props.from.getMonth() / 2 + 1);
        if (seasons.length === 0 || seasons.some(season => season !== seasons[0])) return Err("Sections 有誤");
        const id = new SeasonId({ year, season: seasons[0] });
        return Ok(new Season(id, { sections }));
    }
}
