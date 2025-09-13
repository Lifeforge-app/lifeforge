import { Button, ComboboxInput, ComboboxOption } from 'lifeforge-ui'

import { useCurrencies } from '../hooks/useCurrencies'
import type { Currency } from '../interfaces/currency_converter_interfaces'

interface CurrencySelectorProps {
  currencies: Currency[]
  fromCurrency: string
  toCurrency: string
  setFromCurrency: (currency: string) => void
  setToCurrency: (currency: string) => void
  handleSwapCurrencies: () => void
}

function CurrencySelector({
  currencies,
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
  handleSwapCurrencies
}: CurrencySelectorProps) {
  const { filteredCurrencies, setQueries } = useCurrencies()

  return (
    <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row">
      <div className="w-full">
        <ComboboxInput
          displayValue={value => {
            const currency = currencies.find(c => c.code === value)

            return currency ? `${currency.code} - ${currency.name}` : ''
          }}
          icon="tabler:arrow-up"
          label="From"
          namespace="apps.currencyConverter"
          setQuery={setQueries.from}
          setValue={setFromCurrency}
          value={fromCurrency}
        >
          {filteredCurrencies.from.map(currency => (
            <ComboboxOption
              key={currency.code}
              label={`${currency.code} - ${currency.name}`}
              value={currency.code}
            />
          ))}
        </ComboboxInput>
      </div>

      <Button
        className="w-full sm:w-auto"
        icon="tabler:arrows-exchange"
        onClick={handleSwapCurrencies}
      />

      <div className="w-full">
        <ComboboxInput
          displayValue={value => {
            const currency = currencies.find(c => c.code === value)

            return currency ? `${currency.code} - ${currency.name}` : ''
          }}
          icon="tabler:arrow-down"
          label="To"
          namespace="apps.currencyConverter"
          setQuery={setQueries.to}
          setValue={setToCurrency}
          value={toCurrency}
        >
          {filteredCurrencies.to.map(currency => (
            <ComboboxOption
              key={currency.code}
              label={`${currency.code} - ${currency.name}`}
              value={currency.code}
            />
          ))}
        </ComboboxInput>
      </div>
    </div>
  )
}

export default CurrencySelector
