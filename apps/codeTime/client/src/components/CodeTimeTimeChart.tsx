import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  type TooltipItem
} from 'chart.js'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { DashboardItem, WithQuery } from 'lifeforge-ui'
import { useCallback, useMemo, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import IntervalSelector from './IntervalSelector'

dayjs.extend(duration)

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
)

function CodeTimeTimeChart({ type }: { type: 'projects' | 'languages' }) {
  const { bgTempPalette, derivedTheme } = usePersonalization()

  const [lastFor, setLastFor] = useState<'7 days' | '30 days'>('7 days')

  const dataQuery = useQuery(
    forgeAPI['code-time'].getLastXDays
      .input({
        days: lastFor.toString()
      })
      .queryOptions()
  )

  const getDailyData = useCallback(
    (days: string[], item: string) =>
      days.map(
        day =>
          dataQuery.data?.find(e => dayjs(e.date).format('DD MMM') === day)?.[
            type
          ][item] || 0
      ),
    [dataQuery.data, type]
  )

  const projectsData = useMemo(() => {
    if (!dataQuery.data && !dataQuery.isSuccess) return []

    const days = dataQuery.data.map(e => dayjs(e.date).format('DD MMM'))

    const data = [...new Set(dataQuery.data.flatMap(e => Object.keys(e[type])))]
      .sort()
      .map(item => ({
        label: item,
        data: getDailyData(days, item)
      }))

    return data
  }, [dataQuery.data, dataQuery.isSuccess])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          display: true,
          position: 'left' as const,
          ticks: {
            callback: (label: number | string) =>
              `${Math.round(parseInt(label.toString()) / 60)}h`,
            stepSize: 60
          },
          grid: { drawOnChartArea: false },
          border: { color: 'rgba(163, 163, 163, 0.5)' }
        },
        x: {
          grid: { drawOnChartArea: false },
          border: { color: 'rgba(163, 163, 163, 0.5)' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            labelColor: (context: TooltipItem<'bar'>) => ({
              borderColor: tinycolor({
                h:
                  (projectsData.findIndex(
                    e => e.label === context.dataset.label
                  ) *
                    360) /
                  projectsData.length,
                s: 100,
                v: 100,
                a: 1
              }).toRgbString(),
              backgroundColor: tinycolor({
                h:
                  (projectsData.findIndex(
                    e => e.label === context.dataset.label
                  ) *
                    360) /
                  projectsData.length,
                s: 100,
                v: 100,
                a: 0.8
              }).toRgbString()
            }),
            label: (context: TooltipItem<'bar'>) => {
              if (context.parsed.y === 0) {
                return ''
              }

              let label = context.dataset.label || ''
              if (label) label += ': '

              if (context.parsed.y) {
                label += dayjs.duration(+context.parsed.y, 'minutes').humanize()
              }

              return label
            }
          }
        }
      }
    }),
    [projectsData]
  )

  return (
    <DashboardItem
      className="h-min"
      componentBesideTitle={
        <IntervalSelector
          className="hidden md:flex"
          lastFor={lastFor}
          options={['7 days', '30 days']}
          setLastFor={setLastFor}
        />
      }
      icon={
        {
          languages: 'tabler:code',
          projects: 'tabler:clipboard'
        }[type]
      }
      namespace="apps.codeTime"
      title={`${type}TimeGraph`}
    >
      <IntervalSelector
        className="mb-4 flex md:hidden"
        lastFor={lastFor}
        options={['7 days', '30 days']}
        setLastFor={setLastFor}
      />
      <div className="h-96 w-full">
        <WithQuery query={dataQuery}>
          {data => (
            <Chart
              data={{
                labels: data.map(e => dayjs(e.date).format('DD MMM')),
                datasets: [
                  ...projectsData.map((project, index) => ({
                    type: 'bar' as const,
                    label: project.label,
                    data: project.data,
                    backgroundColor: tinycolor({
                      h: (index * 360) / projectsData.length,
                      s: 100,
                      v: 100,
                      a: 0.4
                    }).toRgbString(),
                    borderColor: tinycolor({
                      h: (index * 360) / projectsData.length,
                      s: 100,
                      v: 100,
                      a: 1
                    }).toRgbString(),
                    borderWidth: 1,
                    yAxisID: 'y',
                    stack: 'stack1'
                  })),
                  {
                    type: 'line' as const,
                    label: 'Total minutes',
                    data: data.map(e => e.total_minutes),
                    borderColor:
                      derivedTheme === 'dark'
                        ? bgTempPalette[100]
                        : bgTempPalette[500],
                    tension: 0.4,
                    borderWidth: 3,
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF80',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                    pointHoverRadius: 6,
                    yAxisID: 'y'
                  }
                ]
              }}
              options={chartOptions}
              type="bar"
            />
          )}
        </WithQuery>
      </div>
    </DashboardItem>
  )
}

export default CodeTimeTimeChart
