export default function getTransactionClassName(
  transactionCount: number
): string {
  let opacityClass = ''

  if (transactionCount >= 7) {
    opacityClass = 'opacity-70'
  } else if (transactionCount >= 5) {
    opacityClass = 'opacity-50'
  } else if (transactionCount >= 3) {
    opacityClass = 'opacity-30'
  } else if (transactionCount >= 1) {
    opacityClass = 'opacity-10'
  }

  return `absolute left-1/2 top-1/2 z-[-1] flex size-10 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md ${opacityClass}`
}
