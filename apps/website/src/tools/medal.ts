const convertMap = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI" } as Record<number, string>;
const thresholds = [1, 2, 3, 5, 10, 20, 50, 100];

export function romanizeSeason(season: number): string {
  if (season < 1 || season > 6) throw new Error("賽季應為 1 ~ 6");
  return convertMap[season];
}

export function findMedalClass(rank: number): string {
  for (const threshold of thresholds) {
    if (threshold >= rank) return `medal-${threshold}`;
  }
  throw new Error("沒有獎牌的排名，應當過濾掉");
}
