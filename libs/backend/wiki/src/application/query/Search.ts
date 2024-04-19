import { Query } from "@t1fr/backend/ddd-types";

type SearchData = {
    name: string;
    country: string | null;
    rank: number | null;
    limit: number;
}

export type SearchResult = {
    vehicles: {
        id: string;
        name: string;
        rank: number;
        country: string;
    }[]
}

export class Search extends Query<SearchData> {
}
