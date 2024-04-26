import { Query } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class FindCurrentSection extends Query<FindCurrentSection, FindCurrentSectionOutput> {
    constructor() {
        super(undefined);
    }

    override get schema() {
        return z.undefined();
    }
}

export type FindCurrentSectionOutput = {
    from: Date;
    to: Date;
    battleRating: number;
};
