import { CurrencyInput, DashboardItem, ModuleHeader } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import ConversionRatesHistoryGraph from './components/ConversionRatesHistoryGraph'
import ConversionResult from './components/ConversionResult'
import CurrencySelector from './components/CurrencySelector'
import { useCurrencies } from './hooks/useCurrencies'
import type { ExchangeRates } from './interfaces/currency_converter_interfaces'

function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1)

  const [fromCurrency, setFromCurrency] = useState<string>('MYR')

  const [toCurrency, setToCurrency] = useState<string>('SGD')

  const [result, setResult] = useState<number | null>(null)

  const [ratesData, setRatesData] = useState<ExchangeRates | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [error, setError] = useState<Error | null>(null)

  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const { currencies } = useCurrencies()

  useEffect(() => {
    if (!fromCurrency) return

    setIsLoading(true)
    setError(null)

    fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`)
        }

        return res.json()
      })
      .then(data => {
        if (data && data.result === 'success' && data.rates) {
          setRatesData({
            base: data.base_code,
            rates: data.rates,
            timestamp: data.time_last_update_unix
          })
          setLastUpdated(
            new Date(data.time_last_update_unix * 1000).toDateString()
          )
          setError(null)
        } else {
          throw new Error(data?.error || 'Invalid API response format')
        }
      })
      .catch(err => {
        console.error('Currency conversion error:', err)
        setError(err)
        setResult(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [fromCurrency])

  useEffect(() => {
    if (ratesData && ratesData.rates && amount) {
      if (!isNaN(amount) && ratesData.rates[toCurrency]) {
        const convertedValue = amount * ratesData.rates[toCurrency]

        setResult(convertedValue)
      }
    }
  }, [amount, toCurrency, ratesData])

  function handleSwapCurrencies() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <>
      <ModuleHeader />
      <CurrencyInput
        required
        className="mb-6"
        icon="tabler:cash"
        label="Amount"
        namespace="apps.currencyConverter"
        placeholder="0.00"
        setValue={setAmount}
        value={amount}
      />
      <CurrencySelector
        currencies={currencies}
        fromCurrency={fromCurrency}
        handleSwapCurrencies={handleSwapCurrencies}
        setFromCurrency={setFromCurrency}
        setToCurrency={setToCurrency}
        toCurrency={toCurrency}
      />
      <DashboardItem
        className="h-min"
        icon="tabler:currency-dollar"
        namespace="apps.currencyConverter"
        title="Conversion Result"
      >
        <ConversionResult
          amount={amount}
          error={error}
          fromCurrency={fromCurrency}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
          ratesData={ratesData}
          result={result}
          toCurrency={toCurrency}
        />
      </DashboardItem>
      <DashboardItem
        className="my-6"
        icon="tabler:graph"
        namespace="apps.currencyConverter"
        title="Conversion Rates History"
      >
        <ConversionRatesHistoryGraph />
      </DashboardItem>
    </>
  )
}

export default CurrencyConverter
