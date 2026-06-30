import './index.css'

;(
  window as unknown as { process: { env: Record<string, string | undefined> } }
).process = {
  env: {}
}

import('./bootstrap')
