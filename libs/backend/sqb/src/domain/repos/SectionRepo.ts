import { Inject } from "@nestjs/common";
import type { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { type SeasonMeta, Section } from "../model";

export const SectionRepo = () => Inject(SectionRepo);

export interface SectionRepo {
    save(Sections: Section[]): AsyncActionResult<SeasonMeta>;

    findSeason(time: Date): AsyncActionResult<Section[]>;

    findOngoingSection(time: Date): AsyncActionResult<Section>;

    findLatestSeason(): AsyncActionResult<Section[]>;
}
