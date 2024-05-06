import { Injectable, type Provider } from "@nestjs/common";
import { type AsyncActionResult, UnexpectedError } from "@t1fr/backend/ddd-types";
import { AsyncResult, Err, Ok } from "ts-results-es";
import { type SeasonMeta, SeasonNotFoundError, Section, SectionNotFoundError, SectionRepo } from "../domain";
import { InjectSectionModel, type SectionModel, SectionSchema } from "./SectionSchema";

@Injectable()
class MongoSectionRepo implements SectionRepo {
    @InjectSectionModel()
    private readonly sectionModel!: SectionModel;

    private modelToDoc(model: Section): SectionSchema {
        const { year, seasonIndex } = model.meta;
        return { year: year, seasonIndex: seasonIndex, from: model.from, to: model.to, battleRating: model.battleRating };
    }

    private docToModel(doc: SectionSchema): Section {
        const { from, to, battleRating } = doc;

        return Section.rebuild({ from, to, battleRating });
    }

    save(sections: Section[]): AsyncActionResult<SeasonMeta> {
        const docs = sections.map(section => this.modelToDoc(section));
        const promise = this.sectionModel.insertMany(docs).then(docs => Ok({ year: docs[0].year, seasonIndex: docs[0].seasonIndex }));
        return new AsyncResult(promise);
    }

    findSeason(time: Date): AsyncActionResult<Section[]> {
        const { year, seasonIndex } = Section.getMetaFromTime(time);
        const promise = this.sectionModel
            .find({ year, seasonIndex })
            .lean()
            .then(docs => (docs.length ? Ok(docs.map(it => this.docToModel(it))) : Err(SeasonNotFoundError.create(year, seasonIndex))));
        return new AsyncResult(promise);
    }

    findOngoingSection(time: Date): AsyncActionResult<Section> {
        const promise = this.sectionModel
            .findOne({ from: { $lte: time }, to: { $gt: time } })
            .lean()
            .then(doc => (doc ? Ok(this.docToModel(doc)) : Err(SectionNotFoundError.create(time))));
        return new AsyncResult(promise);
    }

    findLatestSeason(): AsyncActionResult<Section[]> {
        const promise = this.sectionModel
            .aggregate()
            .group({ _id: { year: "$year", seasonIndex: "$seasonIndex" }, sections: { $push: "$$ROOT" } })
            .sort({ "_id.year": -1, "_id.seasonIndex": -1 })
            .limit(1)
            .unwind("sections")
            .replaceRoot("sections")
            .then(docs => (docs.length ? Ok(docs.map(this.docToModel)) : Err(UnexpectedError.create("賽季資料庫為空"))));
        return new AsyncResult(promise);
    }
}

export const MongooseSectionRepoProvider: Provider = { provide: SectionRepo, useClass: MongoSectionRepo };
