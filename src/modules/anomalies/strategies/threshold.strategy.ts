import { AnomalyDetectionStrategy } from '../interfaces'

export class ThresholdStrategy implements AnomalyDetectionStrategy {
  detectAnomaly(postCount: number, threshold: number): boolean {
    return postCount > threshold
  }
}
