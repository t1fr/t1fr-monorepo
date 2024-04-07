// noinspection SpellCheckingInspection
import { Squad } from "./season.schema";

export class LeaderboardData {
  pos!: number;
  _id!: number;
  astat!: {
    akills_hist: number;
    battles_hist: number;
    deaths_hist: number;
    dr_era5_hist: number;
    ftime_hist: number;
    gkills_hist: number;
    wins_hist: number;
  };
  tagl!: string;
}

export function processLeaderboardData(data: LeaderboardData): Squad {
  // noinspection SpellCheckingInspection
  const { dr_era5_hist, battles_hist, deaths_hist, ftime_hist, wins_hist, gkills_hist, akills_hist } = data.astat;
  return {
    position: data.pos + 1,
    point: dr_era5_hist,
    tag: data.tagl,
    statistic: {
      airKills: akills_hist,
      groundKills: gkills_hist,
      battles: battles_hist,
      deaths: deaths_hist,
      period: ftime_hist,
      wins: wins_hist,
    },
  };
}
