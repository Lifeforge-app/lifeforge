import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
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
import clsx from 'clsx'
import dayjs from 'dayjs'
import { DashboardItem, QueryWrapper } from 'lifeforge-ui'
import { useCallback, useMemo, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

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
  const { t } = useTranslation('apps.codeTime')

  const { bgTempPalette, derivedTheme } = usePersonalization()

  const [lastFor, setLastFor] = useState<7 | 30>(7)

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
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <p className="ml-2 shrink-0 font-medium tracking-wider sm:ml-0">
            {t('labels.inThePast')}
          </p>
          <div className="ml-4 flex shrink-0 gap-2 rounded-lg">
            {([7, 30] as const).map((last, index) => (
              <button
                key={index}
                className={clsx(
                  'rounded-md p-4 px-6 tracking-wide',
                  lastFor === last
                    ? 'bg-bg-200 text-bg-800 dark:bg-bg-700/50 dark:text-bg-50 font-semibold'
                    : 'text-bg-500 hover:bg-bg-100 dark:hover:bg-bg-700/50'
                )}
                onClick={() => {
                  setLastFor(last)
                }}
              >
                {last} {t('units.days')}
              </button>
            ))}
          </div>
        </div>
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
      <div className="h-96 w-full">
        <QueryWrapper query={dataQuery}>
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
        </QueryWrapper>
      </div>
    </DashboardItem>
  )
}

export default CodeTimeTimeChart
