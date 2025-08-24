import { Icon } from '@iconify/react'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { Button, ListboxInput, ListboxOption } from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { usePersonalization } from 'shared'

import { CURRENCIES } from '../constants/currencies'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function ConversionRatesHistoryGraph() {
  const { derivedThemeColor: themeColor } = usePersonalization()

  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([])

  const [chartData, setChartData] = useState<any>({})

  const [fromCurrency, setFromCurrency] = useState('USD')

  const [toCurrency, setToCurrency] = useState('MYR')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch('https://api.frankfurter.app/currencies')
      .then(res => res.json())
      .then(data => setSupportedCurrencies(Object.keys(data)))
      .catch(err => console.error('Error fetching currencies:', err))
  }, [])

  useEffect(() => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) return

    setIsLoading(true)
    fetch(
      `https://api.frankfurter.app/1999-01-04..?from=${fromCurrency}&to=${toCurrency}`
    )
      .then(res => res.json())
      .then(data => {
        const entries = Object.entries(data.rates).map(([k, v]) => [
          k,
          Object.values(v as any)[0]
        ])

        setChartData({
          labels: entries.map(([k]) =>
            new Date(k as string).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short'
            })
          ),
          datasets: [
            {
              label: `${fromCurrency} to ${toCurrency}`,
              data: entries.map(([, v]) => v),
              borderColor: themeColor,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              pointBorderColor: 'rgba(0, 0, 0, 0)',
              pointBackgroundColor: 'rgba(0, 0, 0, 0)',
              pointHoverBackgroundColor: themeColor,
              pointHoverBorderColor: themeColor,
              lineTension: 0.4
            }
          ]
        })
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error fetching conversion rates:', err)
        setIsLoading(false)
      })
  }, [fromCurrency, toCurrency])

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          displayColors: false
        }
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6
        }
      },
      scales: {
        x: {
          grid: {
            lineWidth: 0
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 12
          }
        },
        y: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 7
          }
        }
      },
      hover: {
        mode: 'index',
        intersect: false
      }
    }),
    []
  )

  return (
    <>
      <div className="flex-center flex w-full flex-col gap-3 sm:flex-row">
        <ListboxInput
          buttonContent={
            <div className="flex items-center gap-2">
              {CURRENCIES[fromCurrency] && (
                <Icon
                  icon={`circle-flags:${CURRENCIES[fromCurrency][3].toLowerCase()}`}
                />
              )}
              <span>
                {fromCurrency} - {CURRENCIES[fromCurrency]?.[0]}
              </span>
            </div>
          }
          className="w-full"
          icon="tabler:arrow-up"
          label="From"
          namespace="apps.currencyConverter"
          setValue={setFromCurrency}
          value={fromCurrency}
        >
          {supportedCurrencies.map(code => (
            <ListboxOption
              key={code}
              icon={
                <Icon
                  icon={`circle-flags:${CURRENCIES[code]?.[3].toLowerCase()}`}
                />
              }
              label={`${code} - ${CURRENCIES[code]?.[0] || ''}`}
              value={code}
            />
          ))}
        </ListboxInput>
        <Button
          className="w-full sm:w-auto"
          icon="tabler:arrows-exchange"
          onClick={() => {
            setFromCurrency(toCurrency)
            setToCurrency(fromCurrency)
          }}
        />
        <ListboxInput
          buttonContent={
            <div className="flex items-center gap-2">
              {CURRENCIES[toCurrency] && (
                <Icon
                  icon={`circle-flags:${CURRENCIES[toCurrency][3].toLowerCase()}`}
                />
              )}
              <span>
                {toCurrency} - {CURRENCIES[toCurrency]?.[0]}
              </span>
            </div>
          }
          className="w-full"
          icon="tabler:arrow-down"
          label="To"
          namespace="apps.currencyConverter"
          setValue={setToCurrency}
          value={toCurrency}
        >
          {supportedCurrencies.map(code => (
            <ListboxOption
              key={code}
              icon={
                <Icon
                  icon={`circle-flags:${CURRENCIES[code]?.[3].toLowerCase()}`}
                />
              }
              label={`${code} - ${CURRENCIES[code]?.[0] || ''}`}
              value={code}
            />
          ))}
        </ListboxInput>
      </div>

      <div className="relative mt-4 min-h-64 flex-1">
        {isLoading ? (
          <div className="flex-center size-full">
            <div className="loader"></div>
          </div>
        ) : (
          Object.keys(chartData).length > 0 && (
            <div className="h-full">
              <Line data={chartData} options={options as any} />
            </div>
          )
        )}
      </div>
    </>
  )
}
