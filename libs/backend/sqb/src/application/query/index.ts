import { FindCurrentSeasonHandler } from "./FindCurrentSeasonHandler";
import { FindCurrentSectionHandler } from "./FindCurrentSectionHandler";
import { GetLatestSeasonHandler } from "./GetLatestSeasonHandler";
import { SearchMatchRecordsHandler } from "./SearchMatchRecordsHandler";

export * from "./FindCurrentSeason";
export * from "./FindCurrentSection";
export * from "./GetLatestSeason";
export * from "./SearchMatchRecords";
export * from "./Season";

export const SqbQueryHandlers = [
    GetLatestSeasonHandler,
    FindCurrentSeasonHandler,
    FindCurrentSectionHandler,
    SearchMatchRecordsHandler
];
