export interface Currency {
  code: string
  name: string
  symbol: string
  country: string
}

export interface ExchangeRates {
  base: string
  rates: Record<string, number>
  timestamp: number
}
