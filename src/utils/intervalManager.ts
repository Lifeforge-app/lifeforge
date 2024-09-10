/* eslint-disable @typescript-eslint/strict-boolean-expressions */
class IntervalManager {
  private static instance: IntervalManager
  private readonly intervals: Set<NodeJS.Timeout>

  private constructor() {
    this.intervals = new Set<NodeJS.Timeout>()
  }

  public static getInstance(): IntervalManager {
    if (!IntervalManager.instance) {
      IntervalManager.instance = new IntervalManager()
    }

    return IntervalManager.instance
  }

  public setInterval(callback: () => void, delay: number): NodeJS.Timeout {
    const id = setInterval(callback, delay)
    this.intervals.add(id)
    return id
  }

  public clearInterval(id: NodeJS.Timeout): void {
    clearInterval(id)
    this.intervals.delete(id)
  }

  public clearAllIntervals(): void {
    for (const id of this.intervals) {
      clearInterval(id)
    }
    this.intervals.clear()
  }

  public hasIntervals(): boolean {
    return this.intervals.size > 0
  }
}

export default IntervalManager
