import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class SubmitMatches extends Command<SubmitMatches, void> {
    override get schema() {
        return SubmitMatches.schema;
    }

    private static schema = z.object({
        battleRating: z.string(),
        matches: z.object({
            timestamp: z.coerce.date(),
            enemyName: z.string().min(2),
            timeSeries: z.number().array().min(1),
            ourTeam: z.object({ id: z.string(), vehicle: z.string() }).array(),
            enemyTeam: z.object({ id: z.string(), vehicle: z.string() }).array(),
            isVictory: z.boolean().optional()
        }).array()
    })
}

