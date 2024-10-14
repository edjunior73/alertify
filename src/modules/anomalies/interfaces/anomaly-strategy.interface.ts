export interface AnomalyStrategy {
  detectAnomaly(tweetCounts: number[], threshold: number): boolean
}
