export interface Process {
  start(): void
  stop(): void
  update?(delta: number): void
}
