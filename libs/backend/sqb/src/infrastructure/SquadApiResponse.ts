import { z } from "zod";

export const SquadApiResponse = z
    .object({
        pos: z.number(),
        _id: z.number(),
        astat: z.object({
            akills_hist: z.number(),
            battles_hist: z.number(),
            deaths_hist: z.number(),
            dr_era5_hist: z.number(),
            ftime_hist: z.number(),
            gkills_hist: z.number(),
            wins_hist: z.number(),
        }),
        tagl: z.string(),
    })
    .array();

export type SquadApiResponse = z.infer<typeof SquadApiResponse>;
