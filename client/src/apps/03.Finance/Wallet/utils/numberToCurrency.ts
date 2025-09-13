export default function numberToCurrency(number: number): string {
  if (!number) {
    return '0.00'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
    .format(Math.abs(number) < 0.001 ? 0 : number)
    .replace('$', '')
}
