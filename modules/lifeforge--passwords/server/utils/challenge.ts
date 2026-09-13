import { randomUUID } from 'node:crypto'

export let challenge = randomUUID()

setInterval(() => {
  challenge = randomUUID()
}, 1000 * 60)
