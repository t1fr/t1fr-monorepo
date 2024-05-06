import { Query } from "@t1fr/backend/ddd-types";
import { z } from "zod";
import type { Season } from "./Season";

export class FindCurrentSeason extends Query<FindCurrentSeason, Season> {
    constructor() {
        super(undefined);
    }

    override get schema() {
        return z.undefined();
    }
}
