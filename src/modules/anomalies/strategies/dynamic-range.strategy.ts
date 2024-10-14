import { AnomalyDetectionStrategy } from '../interfaces'

export class DynamicRangeStrategy implements AnomalyDetectionStrategy {
  constructor(private readonly tolerance: number) {}

  detectAnomaly(postCount: number, threshold: number): boolean {
    const lowerBound = threshold - this.tolerance
    const upperBound = threshold + this.tolerance
    return postCount < lowerBound || postCount > upperBound
  }
}
