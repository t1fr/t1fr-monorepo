import type { Enum } from "@t1fr/backend/ddd-types";

export const MemberType = { SquadFighter: "squad_fighter", Relaxer: "relaxer" } as const;

export type MemberType = Enum<typeof MemberType>
