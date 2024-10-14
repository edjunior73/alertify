import { Injectable } from '@nestjs/common'
import { AnomalyDetectionStrategy } from '../interfaces'

@Injectable()
export class AnomalyDetectionContext {
  private strategy: AnomalyDetectionStrategy

  setStrategy(strategy: AnomalyDetectionStrategy) {
    this.strategy = strategy
  }

  detectAnomaly(postCount: number, threshold: number): boolean {
    return this.strategy.detectAnomaly(postCount, threshold)
  }
}
