export default function numberToCurrency(number: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
    .format(Math.abs(number) < 0.001 ? 0 : number)
    .replace('$', '')
}
