import { Query } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class SearchMatchRecords extends Query<SearchMatchRecords, SearchMatchRecordsOutput> {

    override get schema() {
        return SearchMatchRecords.schema;
    }

    private static schema = z.object({
        br: z.string(),
        enemyName: z.string().min(2),
        ourName: z.string().min(2),
    })
}


export type SearchMatchRecordsOutput = Array<{
    enemy1?: string;
    enemy2?: string;
    enemy3?: string;
    enemy4?: string;
    enemy5?: string;
    enemy6?: string;
    enemy7?: string;
    enemy8?: string;
    isVictory?: boolean;
}>