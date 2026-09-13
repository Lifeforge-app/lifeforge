/**
 * Determines the appropriate chart scale based on data characteristics.
 *
 * Scale selection logic:
 * 1. When starting from zero with values clustered far from zero:
 *    → Use 'log' for aggressive compression (min value is 5x+ larger than data spread)
 * 2. Low relative variation (spread < 10% of range):
 *    → Use 'sqrt' to amplify small changes
 * 3. High range ratio (max/min > threshold): Wide spread between smallest and largest
 *    → Use 'sqrt' to make small values visible
 * 4. Otherwise: Use 'linear'
 *
 * @param values - Array of numeric values to analyze
 * @param options - Configuration options
 * @param options.cvThreshold - CV threshold (default 0.1 = 10%)
 * @param options.rangeRatioThreshold - Max/min ratio threshold (default 10)
 * @param options.startFromZero - Whether the chart starts from zero (default true)
 * @param options.logRatio - When min / dataSpread > this, use log (default 5)
 * @returns 'log' | 'sqrt' | 'linear'
 */
function getChartScale(
  values: number[],
  options: {
    cvThreshold?: number
    rangeRatioThreshold?: number
    startFromZero?: boolean
    logRatio?: number
  } = {}
): 'log' | 'sqrt' | 'linear' {
  const {
    cvThreshold = 0.1,
    rangeRatioThreshold = 10,
    startFromZero = true,
    logRatio = 5
  } = options

  const positiveValues = values.filter(v => v > 0)

  if (positiveValues.length === 0) return 'linear'

  const mean = positiveValues.reduce((a, b) => a + b, 0) / positiveValues.length

  if (mean === 0) return 'linear'

  const max = Math.max(...positiveValues)

  const min = Math.min(...positiveValues)

  // When chart starts from zero, calculate variation relative to 0-max range
  if (startFromZero) {
    const dataSpread = max - min

    const rangeFromZero = max

    if (rangeFromZero > 0 && dataSpread > 0) {
      const spreadRatio = dataSpread / rangeFromZero

      // Values clustered far from zero - min is much larger than the data spread
      // e.g., values [4800, 5000, 5200]: min=4800, spread=400, ratio=12
      // Use log for more aggressive compression
      if (min / dataSpread > logRatio) {
        return 'log'
      }

      // Low variation - use sqrt
      if (spreadRatio < cvThreshold) {
        return 'sqrt'
      }
    }
  } else {
    // Original CV calculation for charts not starting from zero
    const variance =
      positiveValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      positiveValues.length

    const stdDev = Math.sqrt(variance)

    const cv = stdDev / Math.abs(mean)

    if (cv < cvThreshold) return 'sqrt'
  }

  // Check range ratio (for wide spread between min and max)
  if (min > 0 && max / min > rangeRatioThreshold) return 'sqrt'

  return 'linear'
}

export default getChartScale
