import { createPortal } from 'react-dom'

import { Box, Flex } from '@/components/primitives'
import { Transition } from '@/components/primitives/Transition'

import * as styles from './ModalWrapper.css'

export function ModalWrapper({
  isOpen,
  isTopmost = true,
  children,
  className,
  modalRef,
  zIndex = 0,
  onExited
}: {
  isOpen: boolean
  isTopmost?: boolean
  children: React.ReactNode
  minWidth?: string
  minHeight?: string
  maxWidth?: string
  className?: string
  modalRef?: React.RefObject<HTMLDivElement | null>
  zIndex?: number
  onExited?: () => void
}) {
  return createPortal(
    <Transition
      property={
        isOpen
          ? { property: 'opacity', duration: '200ms', easing: 'ease-out' }
          : [
              {
                property: 'z-index',
                duration: '0.1s',
                easing: 'linear',
                delay: '0.2s'
              },
              { property: 'opacity', duration: '0.2s', easing: 'ease-out' }
            ]
      }
    >
      <Box
        ref={modalRef}
        className={styles.overlay({ topmost: isTopmost })}
        height="100dvh"
        left="0"
        minWidth="0"
        position="fixed"
        style={{
          overscrollBehavior: 'contain',
          opacity: Number(isOpen)
        }}
        top="0"
        width="100%"
        zIndex={isOpen ? zIndex.toString() : '-1'}
        onTransitionEnd={onExited}
      >
        <Transition easing="ease-out" property="transform">
          <Flex
            bg={{ base: 'bg-50', dark: 'bg-900' }}
            className={className}
            direction="column"
            left="50%"
            maxHeight="calc(100dvh - 8rem)"
            maxWidth={{
              base: 'calc(100vw - 4rem)',
              sm: 'calc(100vw - 8rem)'
            }}
            minWidth="0"
            overflowY="auto"
            p="lg"
            position="absolute"
            rounded="xl"
            style={{
              transform: `translate(-50%, -50%) scale(${!isOpen ? '0.9' : isTopmost ? '1' : '0.95'})`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              willChange: 'transform'
            }}
            top="50%"
            width={{
              lg: 'auto',
              base: '100%'
            }}
          >
            {children}
          </Flex>
        </Transition>
      </Box>
    </Transition>,
    document.getElementById('app') || document.body
  )
}
