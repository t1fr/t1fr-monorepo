import { AccountSeasonResult, PointCalculateStage } from './reward-point.service';

class RatingStage implements PointCalculateStage {

  private readonly thresholds = [
    { rating: 1700, point: 20 },
    { rating: 1690, point: 15 },
    { rating: 1400, point: 10 },
    { rating: 1395, point: 8 },
    { rating: 1100, point: 6 },
    { rating: 800, point: 3 },
    { rating: 500, point: 1 },
  ];

  calculate(results: AccountSeasonResult[]): AccountSeasonResult[] {
    results.forEach(result => {
      for (let { rating, point } of this.thresholds) {
        if (result.personalRating >= rating) {
          result.point = point;
          result.reasons.push(`Fin. PR ${result.personalRating.toString().padStart(4)} ≧ ${rating.toString().padStart(4)} ➔ ${point.toString().padStart(2)}`);
          break;
        }
      }
    });
    return results;
  }
}

export const ratingStage = new RatingStage();