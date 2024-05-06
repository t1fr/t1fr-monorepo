import { Section } from "../../domain";
import type { Season } from "./Season";

export class SeasonMapper {
    static fromSections(sections: Section[]): Season {
        const { year, seasonIndex } = sections[0].meta;
        return {
            year,
            seasonIndex,
            sections: sections.map(it => ({
                to: it.to,
                from: it.from,
                battleRating: it.battleRating,
            })),
        };
    }
}