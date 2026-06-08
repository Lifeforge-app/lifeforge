import { ListboxOption as HeadlessListboxOption } from '@headlessui/react'

import {
  Box,
  Flex,
  Icon,
  Text,
  Transition,
  WithDivide
} from '@/components/primitives'

export function ListboxNullOption({
  icon,
  value = '',
  hasBgColor = false,
  text = 'None'
}: {
  icon: string
  value?: unknown
  hasBgColor?: boolean
  text?: string
}) {
  return (
    <WithDivide>
      <Transition>
        <Text asChild align="left">
          <Flex
            asChild
            align="center"
            bg={{ hover: 'bg-200', darkHover: 'bg-700' }}
            justify="between"
            p="md"
            position="relative"
            width="100%"
          >
            <HeadlessListboxOption value={value}>
              {({ selected }) => (
                <>
                  <Text
                    asChild
                    color={
                      selected ? { base: 'bg-800', dark: 'bg-100' } : undefined
                    }
                    weight="medium"
                  >
                    <Flex
                      align="center"
                      gap={hasBgColor ? undefined : 'sm'}
                      style={hasBgColor ? { gap: '0.75rem' } : undefined}
                    >
                      <Box
                        as="span"
                        flexShrink="0"
                        p={hasBgColor ? 'sm' : undefined}
                        pr={!hasBgColor ? 'sm' : undefined}
                        r="md"
                      >
                        {hasBgColor ? (
                          <Icon color="muted" icon={icon} />
                        ) : (
                          <Icon icon={icon} />
                        )}
                      </Box>
                      <span>{text}</span>
                    </Flex>
                  </Text>
                  {selected && (
                    <Icon color="primary" icon="tabler:check" size="lg" />
                  )}
                </>
              )}
            </HeadlessListboxOption>
          </Flex>
        </Text>
      </Transition>
    </WithDivide>
  )
}
