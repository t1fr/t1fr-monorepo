import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";


export class NewSeasonFromText extends Command<NewSeasonFromText> {
    override get schema() {
        return NewSeasonFromText.schema;
    }

    private static schema = z.object({
        year: z.coerce.number(),
        text: z.string(),
    });
}

