import { useModuleSidebarState } from '@lifeforge/shared'

import { Icon } from '@/components/primitives'
import { Box, Transition } from '@/components/primitives'

import * as styles from './SidebarActionButton.css'

export function SidebarActionButton({
  icon,
  onClick
}: {
  icon: string
  onClick: () => void
}) {
  const { setIsSidebarOpen } = useModuleSidebarState()

  return (
    <Transition duration={200} property="opacity">
      <Box asChild p="sm" rounded="md" zIndex="9999">
        <button
          className={styles.actionButton}
          onClick={e => {
            e.stopPropagation()
            onClick()
            setIsSidebarOpen(false)
          }}
        >
          <Icon icon={icon} style={{ height: '1.25rem', width: '1.25rem' }} />
        </button>
      </Box>
    </Transition>
  )
}
