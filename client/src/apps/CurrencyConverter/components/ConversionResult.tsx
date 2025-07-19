import { Icon } from '@iconify/react'
import { ErrorScreen, LoadingScreen } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useCurrencies } from '../hooks/useCurrencies'
import { ExchangeRates } from '../interfaces/currency_converter_interfaces'

interface ConversionResultProps {
  amount: number
  fromCurrency: string
  toCurrency: string
  result: number | null
  ratesData: ExchangeRates | null
  isLoading: boolean
  error: Error | null
  lastUpdated: string | null
}

function ConversionResult({
  amount,
  fromCurrency,
  toCurrency,
  result,
  ratesData,
  isLoading,
  error,
  lastUpdated
}: ConversionResultProps) {
  const { t } = useTranslation('apps.currencyConverter')

  const { currencies } = useCurrencies()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen message={error.message} />
  }

  return (
    <div className="text-center">
      {ratesData && ratesData.rates && ratesData.rates[toCurrency] ? (
        <>
          <div className="flex-center flex-wrap gap-2 text-3xl font-bold">
            <div className="flex-center gap-2">
              <Icon
                className="mr-1 text-2xl"
                icon={`circle-flags:${currencies.find(c => c.code === fromCurrency)?.country.toLowerCase()}`}
              />
              <span>{amount.toLocaleString()}</span>
              <span className="text-bg-500">{fromCurrency}</span>
            </div>
            <span className="mx-4 block w-full md:w-auto">=</span>
            <div className="flex-center gap-2">
              <Icon
                className="mr-1 text-2xl"
                icon={`circle-flags:${currencies.find(c => c.code === toCurrency)?.country.toLowerCase()}`}
              />
              <span>
                {result?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}
              </span>
              <span className="text-bg-500">{toCurrency}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-bg-500">
              1 {fromCurrency} = {ratesData.rates[toCurrency].toFixed(4)}{' '}
              {toCurrency} • {t('misc.updatedMsg')}{' '}
              {lastUpdated ||
                new Date(ratesData.timestamp * 1000).toLocaleTimeString()}
            </span>
          </div>
        </>
      ) : (
        <div className="text-bg-500 py-4 text-xl">
          {toCurrency
            ? `Exchange rate for ${fromCurrency} to ${toCurrency} is not available`
            : 'No conversion data available'}
        </div>
      )}
    </div>
  )
}

export default ConversionResult
