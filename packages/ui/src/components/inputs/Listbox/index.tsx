import { Listbox as HeadlessListbox, ListboxButton } from '@headlessui/react'

import { Icon } from '@/components/primitives'
import { Flex, type FlexProps, Text, Transition } from '@/components/primitives'

import { ListboxOptions } from '../ListboxInput/components/ListboxOptions'

type ListboxWithMultiple<T> = {
  value: T[]
  onChange: (value: T[]) => void
  renderContent?: (value: T[]) => React.ReactNode
  children: React.ReactNode
  multiple: true
}

type ListboxWithoutMultiple<T> = {
  value: T
  onChange: (value: T) => void
  renderContent?: (value: T) => React.ReactNode
  children: React.ReactNode
  multiple?: never
}

type ListboxProps<T> = { disabled?: boolean } & (
  | ListboxWithMultiple<T>
  | ListboxWithoutMultiple<T>
) &
  Omit<FlexProps, 'onChange' | 'value'>

/**
 * A listbox component for selecting from a list of options. Similar to ListboxInput but without the input box styling.
 */
export function Listbox<T>({
  value,
  onChange,
  renderContent,
  children,
  multiple,
  disabled = false,
  ...rest
}: ListboxProps<T>) {
  return (
    <HeadlessListbox
      disabled={disabled}
      multiple={multiple}
      value={value as never}
      onChange={onChange as never}
    >
      <Transition property="all">
        <Flex
          asChild
          shadow
          align="center"
          bg={{
            base: 'bg-50',
            dark: 'bg-900',
            hover: disabled ? undefined : 'bg-100',
            darkHover: disabled ? undefined : 'bg-800'
          }}
          gap="lg"
          justify="between"
          minWidth="0"
          p="md"
          r="lg"
          style={disabled ? { opacity: 0.5 } : undefined}
          width="100%"
          {...rest}
        >
          <ListboxButton
            style={disabled ? { cursor: 'not-allowed' } : undefined}
          >
            {renderContent ? (
              renderContent(value as never)
            ) : (
              <Text truncate align="left" whiteSpace="nowrap">
                {value as unknown as string}
              </Text>
            )}
            <Text asChild color="muted" style={{ flexShrink: 0 }}>
              <Icon icon="tabler:chevron-down" />
            </Text>
          </ListboxButton>
        </Flex>
      </Transition>
      <ListboxOptions>{children}</ListboxOptions>
    </HeadlessListbox>
  )
}
