import { Listbox as HeadlessListbox, ListboxButton } from '@headlessui/react'

import { Icon } from '@/components/primitives'
import { Flex, type FlexProps, Text, Transition } from '@/components/primitives'
import { surface } from '@/system'

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
  ListboxWithMultiple<T> | ListboxWithoutMultiple<T>
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
          bg={rest.bg ?? surface.defaultInteractive}
          gap="lg"
          height="4em"
          justify="between"
          minWidth="0"
          px="md"
          r="lg"
          style={disabled ? { opacity: 0.5 } : undefined}
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
            <Icon color="muted" icon="tabler:chevron-down" />
          </ListboxButton>
        </Flex>
      </Transition>
      <ListboxOptions>{children}</ListboxOptions>
    </HeadlessListbox>
  )
}
