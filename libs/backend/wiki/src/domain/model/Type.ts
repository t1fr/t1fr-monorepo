export const Type = {
	Army: "army",
	Aviation: "aviation",
	Boat: "boat",
	Helicopters: "helicopters",
	Ship: "ship",
} as const;

export type Type = typeof Type[keyof typeof Type]