import type { ChartOptions } from 'chart.js'
import { useMemo } from 'react'
import { usePersonalization } from 'shared'

export function useChartOptions(range: 'week' | 'month' | 'ytd'): ChartOptions {
  const { bgTempPalette, derivedTheme } = usePersonalization()

  return useMemo<ChartOptions<'bar'>>(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          display: true,
          type: range !== 'ytd' ? ('logarithmic' as const) : undefined,
          min: 0.1,
          grid: {
            color: bgTempPalette[derivedTheme === 'dark' ? '800' : '200']
          }
        },
        x: {
          display: true,
          grid: {
            color: bgTempPalette[derivedTheme === 'dark' ? '800' : '200']
          }
        }
      },
      hover: {
        intersect: false
      }
    }),
    [range]
  )
}
