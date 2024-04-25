import { Query } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export type SearchOutput = {
    vehicles: {
        id: string;
        name: string;
        rank: number;
        country: string;
    }[]
}

export class Search extends Query<Search, SearchOutput> {
    override get schema() {
        return Search.schema;
    }

    private static schema = z.object({
        name: z.string(),
        country: z.string().nullable(),
        rank: z.number().nullable(),
        limit: z.number(),
    });
}
