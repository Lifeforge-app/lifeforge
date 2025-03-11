import { Icon } from '@iconify/react'
import { hsvaToHex, hsvaToRgbaString } from '@uiw/react-color'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import clsx from 'clsx'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import { QueryWrapper } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

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

function CodeTimeTimeChart({
  type
}: {
  type: 'projects' | 'languages'
}): React.ReactElement {
  const { t } = useTranslation('modules.codeTime')
  const [lastFor, setLastFor] = useState<7 | 30>(7)
  const dataQuery = useAPIQuery<any[]>(
    `code-time/last-x-days?days=${lastFor}`,
    ['code-time', 'last-x-days', lastFor]
  )

  const projectsData = useMemo(() => {
    if (!dataQuery.data && !dataQuery.isSuccess) return []

    const days = dataQuery.data.map(e => moment(e.date).format('DD MMM'))
    const data = [...new Set(dataQuery.data.flatMap(e => Object.keys(e[type])))]
      .sort()
      .map(item => ({
        label: item,
        data: days.map(
          day =>
            dataQuery.data.find(e => moment(e.date).format('DD MMM') === day)?.[
              type
            ][item] || 0
        )
      }))

    return data
  }, [dataQuery.data, dataQuery.isSuccess])

  const chartOptions = useMemo(
    () => ({
      scales: {
        y: {
          beginAtZero: true,
          display: true,
          position: 'left',
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
            labelColor: (context: any) => ({
              borderColor: hsvaToHex({
                h:
                  (projectsData.findIndex(
                    e => e.label === context.dataset.label
                  ) *
                    360) /
                  projectsData.length,
                s: 100,
                v: 100,
                a: 1
              }),
              backgroundColor: hsvaToRgbaString({
                h:
                  (projectsData.findIndex(
                    e => e.label === context.dataset.label
                  ) *
                    360) /
                  projectsData.length,
                s: 100,
                v: 100,
                a: 0.8
              })
            }),
            label: (context: any) => {
              if (context.parsed.y === 0) {
                return ''
              }

              let label = context.dataset.label || ''
              if (label) label += ': '
              if (context.parsed.y) {
                label += moment
                  .duration(+context.parsed.y, 'minutes')
                  .humanize()
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
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center lg:gap-8">
        <h1 className="mb-2 flex shrink gap-2 text-2xl font-semibold">
          <Icon
            className="mt-0.5 shrink-0 text-3xl"
            icon={
              {
                languages: 'tabler:code',
                projects: 'tabler:clipboard'
              }[type]
            }
          />
          <span className="ml-2">{t(`headers.${type}TimeGraph`)}</span>
        </h1>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <p className="ml-2 shrink-0 font-medium tracking-wider sm:ml-0">
            {t('labels.inThePast')}
          </p>
          <div className="flex shrink-0 gap-2 rounded-lg p-2">
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
                {last} days
              </button>
            ))}
          </div>
        </div>
      </div>

      <QueryWrapper query={dataQuery}>
        {data => (
          <Chart
            data={{
              labels: data.map(e => moment(e.date).format('DD MMM')),
              datasets: [
                {
                  type: 'line' as any,
                  label: 'Total minutes',
                  data: data.map(e => e.total_minutes),
                  borderColor: `rgba(255,255,255, 1)`,
                  backgroundColor: `rgba(255,200,100,0)`,
                  lineTension: 0.3,
                  borderWidth: 1,
                  pointBorderColor: 'rgba(0, 0, 0, 0)',
                  pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                  pointHoverBackgroundColor: '#FFFFFF80',
                  pointHoverBorderColor: '#FFFFFF',
                  pointHoverBorderWidth: 2,
                  pointHoverRadius: 6,
                  yAxisID: 'y'
                },
                ...projectsData.map((project, index) => ({
                  type: 'bar' as any,
                  label: project.label,
                  data: project.data,
                  backgroundColor: hsvaToRgbaString({
                    h: (index * 360) / projectsData.length,
                    s: 100,
                    v: 100,
                    a: 0.4
                  }),
                  borderColor: hsvaToHex({
                    h: (index * 360) / projectsData.length,
                    s: 100,
                    v: 100,
                    a: 1
                  }),
                  borderWidth: 1,
                  yAxisID: 'y',
                  stack: 'stack1'
                }))
              ]
            }}
            options={chartOptions}
            type="bar"
          />
        )}
      </QueryWrapper>
    </div>
  )
}

export default CodeTimeTimeChart
