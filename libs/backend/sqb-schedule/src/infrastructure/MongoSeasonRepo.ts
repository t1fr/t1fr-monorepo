import { Injectable, Provider } from "@nestjs/common";
import { AsyncActionResult, UnexpectedError } from "@t1fr/backend/ddd-types";
import { AsyncResult, Err, Ok } from "ts-results-es";
import { Season, SeasonId, SeasonNotFoundError, SeasonRepo, Section } from "../domain";
import { InjectSeasonModel, SeasonModel, SeasonSchema } from "./SeasonSchema";

@Injectable()
class MongoSeasonRepo implements SeasonRepo {

    @InjectSeasonModel()
    private readonly seasonModel!: SeasonModel;

    private modelToDoc(model: Season): SeasonSchema {
        const { year, seasonIndex } = model.id.value;
        const sectionDocs: SeasonSchema["sections"] = model.sections.map(section => ({
            from: section.from,
            to: section.to,
            battleRating: section.battleRating,
        }));

        return { year, seasonIndex, sections: sectionDocs };
    }

    private docToModel(doc: SeasonSchema): Season {
        const { year, seasonIndex, sections: sectionDocs } = doc;

        const sections = sectionDocs.map(it => Section.rebuild({ from: it.from, to: it.to, battleRating: it.battleRating }));

        return Season.rebuild(new SeasonId({ year, seasonIndex: seasonIndex }), { sections });
    }

    save(season: Season): AsyncActionResult<SeasonId> {
        const doc = this.modelToDoc(season);
        const promise = this.seasonModel
            .findOneAndUpdate(
                { year: doc.year, seasonIndex: doc.seasonIndex },
                { $set: { sections: doc.sections } },
                { upsert: true },
            )
            .then(() => Ok(season.id))
            .catch(reason => Err(UnexpectedError.create(reason)));
        return new AsyncResult(promise);
    }


    findById(id: SeasonId): AsyncActionResult<Season> {
        const { year, seasonIndex } = id.value;
        const promise = this.seasonModel.findOne({ year, seasonIndex })
            .lean()
            .then(doc => doc ? Ok(this.docToModel(doc)) : Err(SeasonNotFoundError.create(id)))
            .catch(reason => Err(UnexpectedError.create(reason)));
        return new AsyncResult(promise);
    }

    findLatestSeason(): AsyncActionResult<Season> {
        const promise = this.seasonModel
            .find()
            .sort([["year", -1], ["seasonIndex", -1]])
            .limit(1)
            .lean()
            .then(docs => docs.length ? Ok(this.docToModel(docs[0])) : Err(UnexpectedError.create("賽季資料庫為空")))
            .catch(reason => Err(UnexpectedError.create(reason)));
        return new AsyncResult(promise);
    }
}

export const MongooseSeasonRepoProvider: Provider = { provide: SeasonRepo, useClass: MongoSeasonRepo };