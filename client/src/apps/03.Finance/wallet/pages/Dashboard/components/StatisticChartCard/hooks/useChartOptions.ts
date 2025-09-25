import { useMemo } from 'react'

export function useChartOptions(range: 'week' | 'month' | 'ytd') {
  return useMemo(
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
          min: 0.1
        },
        x: {
          display: true
        }
      },
      hover: {
        intersect: false
      }
    }),
    [range]
  )
}
