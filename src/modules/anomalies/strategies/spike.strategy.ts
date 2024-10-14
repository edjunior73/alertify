import { AnomalyDetectionStrategy } from '../interfaces'

export class SpikeStrategy implements AnomalyDetectionStrategy {
  constructor(private readonly spikeValue: number) {}

  detectAnomaly(postCount: number, threshold: number): boolean {
    return postCount > threshold + this.spikeValue
  }
}
