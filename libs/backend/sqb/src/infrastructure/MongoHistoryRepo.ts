import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { AsyncActionResult, UnexpectedError, ZodParseError } from "@t1fr/backend/ddd-types";
import { AsyncResult, Err, Ok } from "ts-results-es";
import { History, HistoryId, HistoryRepo, Performance, Squad } from "../domain";
import { HistoryModel, HistorySchema, InjectHistoryModel } from "./HistorySchema";
import { SquadApiResponse } from "./SquadApiResponse";

@Injectable()
class MongoHistoryRepo implements HistoryRepo {
    @Inject()
    private readonly httpService!: HttpService;

    @InjectHistoryModel()
    private readonly seasonModel!: HistoryModel;


    private modelToDoc(history: History): HistorySchema {
        const { year, seasonIndex } = history.id.value;
        const squadToDoc = (squad: Squad) => {
            const { id, tag, point, position, performance } = squad.props;
            const { deaths, battles, period, wins, groundKills, airKills } = performance.props;
            return {
                id,
                tag,
                point,
                position,
                performance: { deaths, wins, battles, groundKills, airKills, period },
            };
        };
        const top100: HistorySchema["top100"] = history.top100.map(squadToDoc);

        return { year, seasonIndex, top100, me: history.me ? squadToDoc(history.me) : null };
    }

    private static transformReponse(reponse: SquadApiResponse[number]): Squad {
        const { dr_era5_hist, battles_hist, deaths_hist, ftime_hist, wins_hist, gkills_hist, akills_hist } = reponse.astat;
        const performance = Performance.create({
            airKills: akills_hist,
            groundKills: gkills_hist,
            battles: battles_hist,
            deaths: deaths_hist,
            period: ftime_hist,
            wins: wins_hist,
        }).value;
        return Squad.create({ id: reponse._id, position: reponse.pos + 1, point: dr_era5_hist, tag: reponse.tagl, performance }).value;
    }

    fetch(page: number): AsyncActionResult<Squad[]> {
        const url = `https://warthunder.com/en/community/getclansleaderboard/dif/_hist/page/${page}/sort/dr_era5`;
        const promise = this.httpService.axiosRef
            .get<{ data: unknown[] }>(url)
            .then(data => {
                const parseOrError = SquadApiResponse.safeParse(data.data.data);
                if (parseOrError.success) return Ok(parseOrError.data.map(MongoHistoryRepo.transformReponse));
                else return Err(ZodParseError.create(parseOrError.error));
            })
            .catch(reason => Err(UnexpectedError.create(`axios 獲取聯隊統計出錯 ${reason}`)));

        return new AsyncResult(promise);
    }

    save(history: History): AsyncActionResult<HistoryId> {
        const doc = this.modelToDoc(history);
        const promise = this.seasonModel.updateOne({ year: doc.year, seasonIndex: doc.seasonIndex }, doc, { upsert: true }).then(() => Ok(history.id));
        return new AsyncResult(promise);
    }
}

export const MongoHistoryRepoProvider = { provide: HistoryRepo, useClass: MongoHistoryRepo };
