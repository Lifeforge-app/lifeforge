import { ListboxOptions as HeadlessListboxOptions } from '@headlessui/react'

import { Bordered, Text } from '@components/primitives'

import * as styles from './ListboxOptions.css'

function ListboxOptions({
  children,
  customWidth,
  lighter = false,
  portal = true
}: {
  children: React.ReactNode
  customWidth?: string
  lighter?: boolean
  portal?: boolean
}) {
  return (
    <Text asChild color="muted" size="base">
      <Bordered
        asChild
        shadow
        bg={{ base: lighter ? 'bg-50' : 'bg-100', dark: 'bg-800' }}
        className={styles.options}
        overflowY="auto"
        position={!portal ? 'absolute' : undefined}
        rounded="md"
        style={{
          // @ts-expect-error - headlessui CSS variable
          '--anchor-gap': '12px',
          width: customWidth ?? 'var(--button-width)',
          ...(!portal && {
            top: 'calc(var(--spacing) * 22)',
            left: 0
          })
        }}
        zIndex="9999"
      >
        <HeadlessListboxOptions
          transition
          anchor={portal ? 'bottom start' : undefined}
          portal={portal}
        >
          {children}
        </HeadlessListboxOptions>
      </Bordered>
    </Text>
  )
}

export default ListboxOptions
