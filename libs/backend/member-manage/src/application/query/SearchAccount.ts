import { Query, QueryResult } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export const SearchAccountInput = z.object({
    name: z.string(),
});

type SearchAccountInput = z.infer<typeof SearchAccountInput>

export class SearchAccount extends Query<SearchAccountInput> {
}

export type SearchAccountOutput = { id: string; name: string; }[]

export type SearchAccountResult = QueryResult<SearchAccountOutput>;