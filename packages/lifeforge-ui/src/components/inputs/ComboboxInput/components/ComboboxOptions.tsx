import { ComboboxOptions as HeadlessComboBoxOptions } from '@headlessui/react'

import { Bordered, Text } from '@components/primitives'

import * as styles from './ComboboxOptions.css'

export function ComboboxOptions({
  children,
  customWidth
}: {
  children: React.ReactNode
  customWidth?: string
}) {
  return (
    <Text asChild color="muted" size="base">
      <Bordered
        asChild
        shadow
        bg={{ base: 'bg-100', dark: 'bg-800' }}
        className={styles.options}
        overflowY="auto"
        rounded="md"
        style={{
          // @ts-expect-error - headlessui CSS variable
          '--anchor-gap': '12px',
          width: customWidth ?? 'var(--input-width)'
        }}
        zIndex="9999"
      >
        <HeadlessComboBoxOptions anchor="bottom start">
          {children}
        </HeadlessComboBoxOptions>
      </Bordered>
    </Text>
  )
}

