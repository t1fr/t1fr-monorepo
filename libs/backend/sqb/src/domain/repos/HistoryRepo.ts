import { Inject } from "@nestjs/common";
import type { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { History, HistoryId, Squad } from "../model";

export const HistoryRepo = () => Inject(HistoryRepo);

export interface HistoryRepo {
    save(history: History): AsyncActionResult<HistoryId>;

    fetch(page: number): AsyncActionResult<Squad[]>;
}
