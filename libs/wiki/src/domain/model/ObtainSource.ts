export const ObtainSource = {
	Gift: "gift",
	Store: "store",
	Marketplace: "marketplace",
	Gold: "gold",
	Techtree: "techtree",
	Squad: "squad"
} as const;

export type ObtainSource = typeof ObtainSource[keyof typeof ObtainSource]