import { Enum, isEnum } from "@t1fr/backend/ddd-types";

export const Type = {
    Army: "army",
    Aviation: "aviation",
    Boat: "boat",
    Helicopters: "helicopters",
    Ship: "ship",
} as const;

export type Type = Enum<typeof Type>
export const isValidType = isEnum(Type);