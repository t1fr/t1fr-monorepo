import { Inject, Injectable } from "@nestjs/common";
import { Performance, Squad } from "../domain";
import { Ok } from "ts-results-es";
import { HttpService } from "@nestjs/axios";
import { SquadApiResponse } from "./SquadApiResponse";

@Injectable()
export class SquadDataScraper {

	@Inject()
	private readonly httpService!: HttpService;

	private static transformReponse(reponse: SquadApiResponse): Squad {
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

	async scrap(page: number): Promise<Ok<Squad[]>> {
		const url = `https://warthunder.com/en/community/getclansleaderboard/dif/_hist/page/${page}/sort/dr_era5`;
		const data = await this.httpService.axiosRef.get<{ data: SquadApiResponse[] }>(url);
		const responses = data.data.data;
		return Ok(responses.map(SquadDataScraper.transformReponse));
	}
}
