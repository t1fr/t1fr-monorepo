import { Query } from "@t1fr/backend/ddd-types";
import { z } from "zod";
import { ObtainSource } from "../../domain";

export interface FindByIdOutput {
    vehicle: {
        battleRating: { arcade: number, realistic: number, simulator: number }
        name: string;
        wikiUrl: string | undefined;
        country: string;
        rank: number;
        operator: string;
        imageUrl: string;
        thumbnailUrl: string;
        type: string;
        classes: string[];
    } & ({
        obtainSource: typeof ObtainSource.Gold;
        goldPrice: number;
        event?: string;
    } | {
        obtainSource: typeof ObtainSource.Store;
        storeUrl: string;
    } | {
        obtainSource: typeof ObtainSource.Marketplace;
        marketplaceUrl: string;
        event?: string;
    } | {
        obtainSource: typeof ObtainSource.Gift;
        event?: string;
    } | {
        obtainSource: typeof ObtainSource.Squad | typeof ObtainSource.Techtree;
    });
}

export class FindById extends Query<FindById, FindByIdOutput> {
    override get schema() {
        return FindById.schema;
    }

    private static schema = z.object({
        id: z.string(),
    });
}
