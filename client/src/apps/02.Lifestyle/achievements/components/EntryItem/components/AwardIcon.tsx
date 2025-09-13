import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'

import type { Achievement } from '@apps/02.Lifestyle/achievements'

function AwardIcon({ difficulty }: { difficulty: Achievement['difficulty'] }) {
  return (
    <div
      className={clsx(
        'flex-center size-12 shrink-0 rounded-md',
        {
          easy: 'border-2 border-green-500 bg-green-500/20 text-green-500',
          medium: 'border-2 border-yellow-500 bg-yellow-500/20 text-yellow-500',
          hard: 'border-2 border-red-500 bg-red-500/20 text-red-500',
          impossible:
            'border-2 border-purple-500 bg-purple-500/20 text-purple-500'
        }[difficulty]
      )}
    >
      <Icon className="size-8" icon="tabler:award" />
    </div>
  )
}

export default AwardIcon
