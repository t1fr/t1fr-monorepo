import type { Enum } from "@t1fr/backend/ddd-types";

export const PointType = {
    Reward: "reward",
    Absense: "absense",
    Penalty: "penalty",
} as const;

export type PointType = Enum<typeof PointType>

