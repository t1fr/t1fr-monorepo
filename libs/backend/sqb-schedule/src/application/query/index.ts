import { FindCurrentSeasonHandler } from "./FindCurrentSeasonHandler";
import { FindCurrentSectionHandler } from "./FindCurrentSectionHandler";

export * from "./FindCurrentSeason";
export * from "./FindCurrentSection";

export const SqbQueryHandlers = [
    FindCurrentSeasonHandler,
    FindCurrentSectionHandler,
];