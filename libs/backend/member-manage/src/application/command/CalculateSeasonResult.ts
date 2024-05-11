import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";
import { PointType } from "../../domain";


export class CalculateSeasonResult extends Command<CalculateSeasonResult, CalculateSeasonResultOutput> {
    override get schema() { return CalculateSeasonResult.schema; }
    private static schema = z.object({
        year: z.number(),
        seasonIndex: z.number(),
        write: z.boolean(),
        type: z.nativeEnum(PointType)
    })
}



export type CalculateSeasonResultOutput = Array<{
    group: number | string;
    records: Array<{
        memberId: string;
        comment: string;
    }>
}>