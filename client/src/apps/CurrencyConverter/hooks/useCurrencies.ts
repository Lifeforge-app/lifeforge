import { useMemo, useState } from 'react'

import { CURRENCIES } from '../constants/currencies'
import { Currency } from '../interfaces/currency_converter_interfaces'

export function useCurrencies() {
  const [fromQuery, setFromQuery] = useState<string>('')

  const [toQuery, setToQuery] = useState<string>('')

  const currencies = useMemo<Currency[]>(() => {
    return Object.entries(CURRENCIES).map(([code, data]) => ({
      code,
      name: data[0],
      symbol: data[2],
      country: data[3]
    }))
  }, [])

  const filteredFromCurrencies = useMemo(() => {
    if (!fromQuery.trim()) return currencies

    const query = fromQuery.toLowerCase()

    return currencies.filter(
      currency =>
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query)
    )
  }, [currencies, fromQuery])

  const filteredToCurrencies = useMemo(() => {
    if (!toQuery.trim()) return currencies

    const query = toQuery.toLowerCase()

    return currencies.filter(
      currency =>
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query)
    )
  }, [currencies, toQuery])

  return {
    currencies,
    filteredCurrencies: {
      from: filteredFromCurrencies,
      to: filteredToCurrencies
    },
    queries: {
      from: fromQuery,
      to: toQuery
    },
    setQueries: {
      from: setFromQuery,
      to: setToQuery
    }
  }
}
