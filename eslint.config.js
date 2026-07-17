import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)

const config = await jiti.import('./eslint/config.ts').then(m => m.default)

export default config
