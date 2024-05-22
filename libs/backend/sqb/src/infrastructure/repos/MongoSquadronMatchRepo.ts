import { Injectable, type Provider } from "@nestjs/common";
import type { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { AsyncResult, Ok } from "ts-results-es";
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
                ourTeam: doc.ourTeam,
                isVictory: doc.isVictory,
                battleRating: doc.battleRating,
                timestamp: doc.timestamp
            }
        )
    }

    private modelToDoc(model: SquadronMatch): SquadronMatchSchema {
        const { enemyName, timeSeries, enemyTeam, ourTeam, isVictory, battleRating, timestamp } = model.toObject()
        return {
            _id: model.id.value,
            timeSeries,
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

    async findByEnemyNameAndBr(battleRating: string, name: string): Promise<SquadronMatch[]> {
        return this.matchModel
            .find({ battleRating, enemyName: name })
            .lean()
            .then(docs => docs.map(doc => this.docToModel(doc)))
    }
}

export const MongoSquadronMatchRepoProvider: Provider = { provide: SquadronMatchRepo, useClass: MongoSquadronMatchRepo }