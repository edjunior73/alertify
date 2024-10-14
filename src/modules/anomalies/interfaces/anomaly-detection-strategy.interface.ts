export interface AnomalyDetectionStrategy {
  detectAnomaly(postCount: number, threshold: number): boolean
}
