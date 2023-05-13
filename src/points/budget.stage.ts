import { AccountSeasonResult, PointCalculateStage } from './reward-point.service';

class RatingStage implements PointCalculateStage {

  private readonly budget = 250;

  calculate(results: AccountSeasonResult[]): AccountSeasonResult[] {
    let totalPoints = results.reduce((acc, val) => acc + val.point, 0);
    if (this.budget >= totalPoints) return results;

    const groups = results.reduce((acc: { [key: number]: AccountSeasonResult[] }, val) => {
      const point = val.point;
      if (acc.hasOwnProperty(point)) {
        acc[point].push(val);
      } else {
        acc[point] = [val];
      }
      return acc;
    }, {});

    do {
      for (let point in groups) {
        groups[point].forEach(result => {
          if (result.point !== 0) {
            result.point--;
            totalPoints--;
          }
        });
      }
    } while (this.budget < totalPoints);

    for (let point of Object.keys(groups).sort((a, b) => parseInt(b) - parseInt(a))) {
      const maxPoint = parseInt(point);
      const length = groups[maxPoint].length;
      const space = this.budget - totalPoints;
      const iteration = (maxPoint - groups[maxPoint][0].point) * length;
      const quotient = space / iteration >> 0;
      totalPoints = space % iteration;
      groups[maxPoint].forEach(result => {result.point += quotient;});
    }

    return Object.values(groups).reduce((acc, val) => acc.concat(val));
  }
}

export const budgetStage = new RatingStage();