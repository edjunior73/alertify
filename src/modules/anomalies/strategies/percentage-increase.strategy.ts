import { AnomalyDetectionStrategy } from '../interfaces'

export class PercentageIncreaseStrategy implements AnomalyDetectionStrategy {
  constructor(private readonly percentage: number) {}

  detectAnomaly(postCount: number, threshold: number): boolean {
    return postCount > threshold * (1 + this.percentage / 100)
  }
}
