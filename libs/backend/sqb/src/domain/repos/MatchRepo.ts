import { Inject } from "@nestjs/common";
import type { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { SquadronMatch } from "../model";

export const SquadronMatchRepo = () => Inject(SquadronMatchRepo)

export interface SquadronMatchRepo {
    findWithinTimespan(battleRating: string, from: Date, to: Date): AsyncActionResult<SquadronMatch[]>
    save(matches: SquadronMatch[]): AsyncActionResult<void>;
    findByEnemyNameAndBr(battleRating: string, name: string): Promise<SquadronMatch[]>;
}