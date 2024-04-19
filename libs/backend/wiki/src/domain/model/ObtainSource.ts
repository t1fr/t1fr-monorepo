import { Enum } from "@t1fr/backend/ddd-types";

export const ObtainSource = {
    Gift: "gift",
    Store: "store",
    Marketplace: "marketplace",
    Gold: "gold",
    Techtree: "techtree",
    Squad: "squad",
} as const;


export type ObtainSource = Enum<typeof ObtainSource>
