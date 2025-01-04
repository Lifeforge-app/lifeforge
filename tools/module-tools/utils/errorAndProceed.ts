export async function errorAndProceed(message: string): Promise<void> {
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)
  console.error(message)
  await (async () => await new Promise(resolve => setTimeout(resolve, 1000)))()
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)
}
