import { NewSeasonFromTextHandler } from "./NewSeasonFromTextHandler";
import { SnapshotCurrentSeasonHandler } from "./SnapshotCurrentSeasonHandler";

export * from "./NewSeasonFromText";
export * from "./SnapshotCurrentSeasonHandler";

export const SqbCommandHandlers = [NewSeasonFromTextHandler, SnapshotCurrentSeasonHandler];
