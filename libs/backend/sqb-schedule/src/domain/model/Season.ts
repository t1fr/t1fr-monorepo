import { AggregateRoot, EntityId } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import { SectionSpanError } from "./DomainError";
import { Section } from "./Section";

interface SeasonProps {
    sections: Section[];
}

type SeasonIdValue = { year: number, seasonIndex: number };

export class SeasonId extends EntityId<SeasonIdValue> {
    override equals(entityId: EntityId<SeasonIdValue>): boolean {
        return this.value.year === entityId.value.year && this.value.seasonIndex === entityId.value.seasonIndex;
    }
}

export class Season extends AggregateRoot<SeasonId, SeasonProps> {
    static create(year: number, sections: Section[]) {
        const seasonIndexes = sections.map(section => section.seasonIndex);
        if (seasonIndexes.length === 0 || seasonIndexes.some(season => season !== seasonIndexes[0])) return Err(SectionSpanError.create(seasonIndexes[0], sections));
        const id = new SeasonId({ year, seasonIndex: seasonIndexes[0] });
        return Ok(new Season(id, { sections }));
    }

    static rebuild(id: SeasonId, props: SeasonProps) {
        return new Season(id, props);
    }

    get sections(): Readonly<Section[]> {
        return this.props.sections;
    }

    get year() {
        return this.id.value.year;
    }

    get seasonIndex() {
        return this.id.value.seasonIndex;
    }
}


