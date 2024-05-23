import { NewSeasonFromTextHandler } from "./NewSeasonFromTextHandler";
import { SnapshotCurrentSeasonHandler } from "./SnapshotCurrentSeasonHandler";
import { SubmitMatchesHandler } from "./SubmitMatchesHandler";

export * from "./NewSeasonFromText";
export * from "./SnapshotCurrentSeason";
export * from "./SubmitMatches";

export const SqbCommandHandlers = [
    NewSeasonFromTextHandler,
    SnapshotCurrentSeasonHandler,
    SubmitMatchesHandler
];
