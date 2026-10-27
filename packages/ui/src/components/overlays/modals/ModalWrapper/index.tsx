import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useState } from 'react'

import { Scrollbar } from '@/components/layout/Scrollbar'
import { Box, Flex } from '@/components/primitives'
import { Transition } from '@/components/primitives/Transition'
import type { ModalRole } from '@/providers/ModalProvider'

import {
  ModalA11yContext,
  ModalPortalContainerContext
} from '../ModalA11yContext'
import * as styles from './ModalWrapper.css'

export function ModalWrapper({
  isOpen,
  isTopmost = true,
  children,
  minWidth,
  zIndex = 0,
  onExited,
  onClose,
  role = 'dialog'
}: {
  isOpen: boolean
  isTopmost?: boolean
  children: React.ReactNode
  minWidth?: string
  zIndex?: number
  onExited?: () => void
  onClose?: () => void
  role?: ModalRole
}) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  )

  return (
    <Dialog
      static
      as={Box}
      className={styles.dialog({ open: isOpen })}
      inert={isOpen ? undefined : true}
      inset="0"
      open={isOpen}
      position="fixed"
      role={role}
      zIndex={String(zIndex)}
      onClose={() => onClose?.()}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        // Headless UI closes the dialog on Escape. Modals are dismissed
        // explicitly, so mark Escape as handled to suppress that.
        if (event.key === 'Escape') {
          event.preventDefault()
        }
      }}
    >
      <Transition
        property={{
          property: 'opacity',
          duration: '200ms',
          easing: 'ease-out'
        }}
      >
        <DialogBackdrop
          as={Box}
          className={styles.overlay({ open: isOpen, topmost: isTopmost })}
          height="100dvh"
          inset="0"
          position="fixed"
          width="100%"
          onTransitionEnd={onExited}
        />
      </Transition>
      <Transition
        property={[
          { property: 'opacity', duration: '200ms', easing: 'ease-out' },
          { property: 'transform', duration: '100ms', easing: 'ease-out' }
        ]}
      >
        <DialogPanel
          as={Flex}
          bg={{ base: 'bg-50', dark: 'bg-900' }}
          className={styles.panel({ open: isOpen, topmost: isTopmost })}
          direction="column"
          left="50%"
          maxHeight="calc(100dvh - 8em)"
          maxWidth={{
            base: 'calc(100vw - 4em)',
            sm: 'calc(100vw - 8em)'
          }}
          minHeight="0"
          minWidth={minWidth}
          overflow="hidden"
          p="lg"
          position="fixed"
          r="xl"
          top="50%"
          width={{
            lg: 'auto',
            base: '100%'
          }}
        >
          <ModalA11yContext value={true}>
            <ModalPortalContainerContext value={portalContainer}>
              <Scrollbar hideHorizontal>{children}</Scrollbar>
            </ModalPortalContainerContext>
          </ModalA11yContext>
        </DialogPanel>
      </Transition>
      {/* Portalled overlays land inside the dialog, so Headless UI neither
          marks them inert nor treats clicks on them as outside clicks. */}
      <Box ref={setPortalContainer} />
    </Dialog>
  )
}
