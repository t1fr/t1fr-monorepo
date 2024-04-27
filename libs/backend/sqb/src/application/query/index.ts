import { FindCurrentSeasonHandler } from "./FindCurrentSeasonHandler";
import { FindCurrentSectionHandler } from "./FindCurrentSectionHandler";
import { GetLatestSeasonHandler } from "./GetLatestSeasonHandler";

export * from "./FindCurrentSeason";
export * from "./FindCurrentSection";
export * from "./GetLatestSeason";
export * from "./Season";

export const SqbQueryHandlers = [
    GetLatestSeasonHandler,
    FindCurrentSeasonHandler,
    FindCurrentSectionHandler,
];
