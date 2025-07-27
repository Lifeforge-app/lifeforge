import {
  Button,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from 'lifeforge-ui'

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
        <ListboxOrComboboxInput
          displayValue={value => {
            const currency = currencies.find(c => c.code === value)

            return currency ? `${currency.code} - ${currency.name}` : ''
          }}
          icon="tabler:arrow-up"
          name="From"
          namespace="apps.currencyConverter"
          setQuery={setQueries.from}
          setValue={setFromCurrency}
          type="combobox"
          value={fromCurrency}
        >
          {filteredCurrencies.from.map(currency => (
            <ListboxOrComboboxOption
              key={currency.code}
              text={`${currency.code} - ${currency.name}`}
              type="combobox"
              value={currency.code}
            />
          ))}
        </ListboxOrComboboxInput>
      </div>

      <Button
        className="w-full sm:w-auto"
        icon="tabler:arrows-exchange"
        onClick={handleSwapCurrencies}
      />

      <div className="w-full">
        <ListboxOrComboboxInput
          displayValue={value => {
            const currency = currencies.find(c => c.code === value)

            return currency ? `${currency.code} - ${currency.name}` : ''
          }}
          icon="tabler:arrow-down"
          name="To"
          namespace="apps.currencyConverter"
          setQuery={setQueries.to}
          setValue={setToCurrency}
          type="combobox"
          value={toCurrency}
        >
          {filteredCurrencies.to.map(currency => (
            <ListboxOrComboboxOption
              key={currency.code}
              text={`${currency.code} - ${currency.name}`}
              type="combobox"
              value={currency.code}
            />
          ))}
        </ListboxOrComboboxInput>
      </div>
    </div>
  )
}

export default CurrencySelector
