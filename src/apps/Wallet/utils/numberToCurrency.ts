export default function numberToCurrency(number: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
    .format(number)
    .replace('$', '')
}
