import { NewSeasonFromTextHandler } from "./NewSeasonFromTextHandler";
import { SnapshotCurrentSeasonHandler } from "./SnapshotCurrentSeasonHandler";

export * from "./NewSeasonFromText";
export * from "./SnapshotCurrentSeason";

export const SqbCommandHandlers = [NewSeasonFromTextHandler, SnapshotCurrentSeasonHandler];
