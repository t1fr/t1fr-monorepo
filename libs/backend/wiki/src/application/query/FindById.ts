import { Query } from "@t1fr/backend/ddd-types";
import { ObtainSource } from "../../domain";

type FindByIdData = {
    id: string;
}

export interface FindByIdResult {
    vehicle: {
        battleRating: { arcade: number, realistic: number, simulator: number }
        name: string;
        wikiUrl: string;
        country: string;
        rank: number;
        operator: string;
        imageUrl: string;
        thumbnailUrl: string;
        type: string;
        classes: string[];
        obtainSource: ObtainSource;
        storeUrl?: string;
        marketplaceUrl?: string;
        goldPrice?: number;
        event?: string;
    };
}

export class FindById extends Query<FindByIdData> {

}
