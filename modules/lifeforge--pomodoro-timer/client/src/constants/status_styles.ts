import type { Session } from '@'

import { TAILWIND_PALETTE } from '@lifeforge/ui'

const STATUS_STYLES: Record<
  Session['status'],
  { icon: string; color: string }
> = {
  new: {
    icon: 'tabler:progress',
    color: TAILWIND_PALETTE.sky[500]
  },
  active: {
    icon: 'tabler:progress-bolt',
    color: TAILWIND_PALETTE.orange[500]
  },
  completed: {
    icon: 'tabler:progress-check',
    color: TAILWIND_PALETTE.green[500]
  }
}

export default STATUS_STYLES
