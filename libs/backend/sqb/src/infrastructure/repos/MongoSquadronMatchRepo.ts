import { Injectable, type Provider } from "@nestjs/common";
import type { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { AsyncResult, Ok } from "ts-results-es";
import type { SearchMatchRecordsOutput } from "../../application";
import { SquadronMatch, SquadronMatchId, SquadronMatchRepo } from "../../domain";
import { InjectSquadronMatchModel, SquadronMatchSchema, type SquadronMatchModel } from "../schemas";

@Injectable()
class MongoSquadronMatchRepo implements SquadronMatchRepo {

    @InjectSquadronMatchModel()
    private readonly matchModel!: SquadronMatchModel;

    private docToModel(doc: SquadronMatchSchema & { _id: string }) {
        return SquadronMatch.rebuild(
            new SquadronMatchId(doc._id),
            {
                timeSeries: doc.timeSeries,
                enemyName: doc.enemyName,
                enemyTeam: doc.enemyTeam,
                ourName: doc.ourName,
                ourTeam: doc.ourTeam,
                isVictory: doc.isVictory,
                battleRating: doc.battleRating,
                timestamp: doc.timestamp
            }
        )
    }

    private modelToDoc(model: SquadronMatch): SquadronMatchSchema {
        const { enemyName, timeSeries, enemyTeam, ourName, ourTeam, isVictory, battleRating, timestamp } = model.toObject()
        return {
            _id: model.id.value,
            timeSeries,
            ourName,
            enemyName,
            enemyTeam,
            ourTeam,
            isVictory,
            battleRating,
            timestamp
        }
    }

    findWithinTimespan(battleRating: string, from: Date, to: Date): AsyncActionResult<SquadronMatch[]> {
        const promise = this.matchModel
            .find({ battleRating, timestamp: { $gte: from, $lt: to } })
            .lean()
            .then(docs => Ok(docs.map(doc => this.docToModel(doc))))

        return new AsyncResult(promise)
    }

    upsert(match: SquadronMatch): AsyncActionResult<void> {
        const { _id, ...other } = this.modelToDoc(match);

        const promise = this.matchModel
            .findByIdAndUpdate(_id, { $set: other }, { upsert: true })
            .then(() => Ok.EMPTY)

        return new AsyncResult(promise)
    }

    findByEnemyNameAndBr(battleRating: string, ourName: string, enemyName: string): AsyncActionResult<SearchMatchRecordsOutput> {
        const promise = this.matchModel
            .find({ battleRating, enemyName, ourName })
            .lean()
            .then(docs => Ok(docs.map(doc => {
                const { enemyTeam, isVictory } = doc;
                return {
                    isVictory,
                    enemy1: enemyTeam[0]?.vehicle,
                    enemy2: enemyTeam[1]?.vehicle,
                    enemy3: enemyTeam[2]?.vehicle,
                    enemy4: enemyTeam[3]?.vehicle,
                    enemy5: enemyTeam[4]?.vehicle,
                    enemy6: enemyTeam[5]?.vehicle,
                    enemy7: enemyTeam[6]?.vehicle,
                    enemy8: enemyTeam[7]?.vehicle,
                }
            })))
        return new AsyncResult(promise)
    }
}

export const MongoSquadronMatchRepoProvider: Provider = { provide: SquadronMatchRepo, useClass: MongoSquadronMatchRepo }