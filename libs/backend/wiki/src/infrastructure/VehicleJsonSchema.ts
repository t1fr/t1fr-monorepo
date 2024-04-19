import { z } from "zod";
import { Country, ObtainSource, Type, VehicleClass } from "../domain";


export type VehicleJsonSchema = z.infer<typeof VehicleJsonSchema>

export const VehicleJsonSchema = z.object({
    intname: z.string().min(1),
    wikiname: z.string().optional(),
    country: z.nativeEnum(Country),
    rank: z.number().min(1).max(8),
    br: z.tuple([
        z.coerce.number().min(1.0),
        z.coerce.number().min(1.0),
        z.coerce.number().min(1.0),
    ]),
    type: z.nativeEnum(Type),
    normal_type: z.nativeEnum(VehicleClass),
    extended_type: z.array(z.nativeEnum(VehicleClass)).optional(),
    obtainFrom: z.enum([ObtainSource.Store, ObtainSource.Marketplace, ObtainSource.Gift, ObtainSource.Gold]).optional(),
    cost_gold: z.number().min(0).optional(),
    store: z.string().optional(),
    operator_country: z.nativeEnum(Country).optional(),
    squad: z.boolean().optional(),
    marketplace: z.string().optional(),
    event: z.string().optional(),
});


export type DataResponse = z.infer<typeof DataResponse>

export const DataResponse = z.object({
    version: z.string().min(1),
    army: z.array(VehicleJsonSchema),
    aviation: z.array(VehicleJsonSchema),
    helicopters: z.array(VehicleJsonSchema),
    ship: z.array(VehicleJsonSchema),
    boat: z.array(VehicleJsonSchema),
});