export class SquadronBattleAchievement {
  year!: number;
  season!: number;
  rank!: number;
}

export const squadronBattleAchievements: SquadronBattleAchievement[] = [
  { year: 2022, season: 6, rank: 90 },
  { year: 2023, season: 1, rank: 86 },
  { year: 2023, season: 2, rank: 60 },
  { year: 2023, season: 3, rank: 62 },
  { year: 2023, season: 5, rank: 43 },

  // { year: 2023, season: 5, rank: 1 },
  // { year: 2023, season: 5, rank: 2 },
  // { year: 2023, season: 5, rank: 3 },
  // { year: 2023, season: 5, rank: 4 },
  // { year: 2023, season: 5, rank: 9 },
  // { year: 2023, season: 5, rank: 20 },
].reverse();
