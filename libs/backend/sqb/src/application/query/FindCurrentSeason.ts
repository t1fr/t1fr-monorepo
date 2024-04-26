import { Query } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class FindCurrentSeason extends Query<FindCurrentSeason, FindCurrentSeasonOutput> {
    constructor() {
        super(undefined);
    }

    override get schema() {
        return z.undefined();
    }
}

export type FindCurrentSeasonOutput = {
    year: number;
    seasonIndex: number;
    sections: Array<{
        from: Date;
        to: Date;
        battleRating: number;
    }>;
};
