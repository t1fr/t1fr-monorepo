import { Query } from "@t1fr/backend/ddd-types";
import { z } from "zod";
import type { Season } from "./Season";

export class GetLatestSeason extends Query<GetLatestSeason, Season> {
    constructor() {
        super(undefined);
    }

    override get schema() {
        return z.undefined();
    }
}


