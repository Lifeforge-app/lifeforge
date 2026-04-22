import { ListboxOption as HeadlessListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'

import { Box, Flex, Text, Transition, WithDivide } from '@components/primitives'

function ListboxNullOption({
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
                        rounded="md"
                      >
                        {hasBgColor ? (
                          <Text asChild color="muted">
                            <Icon
                              icon={icon}
                              style={{ width: '1.25rem', height: '1.25rem' }}
                            />
                          </Text>
                        ) : (
                          <Icon
                            icon={icon}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                          />
                        )}
                      </Box>
                      <span>{text}</span>
                    </Flex>
                  </Text>
                  {selected && (
                    <Text
                      asChild
                      color="custom-500"
                      size="lg"
                      style={{ display: 'block', flexShrink: 0 }}
                    >
                      <Icon icon="tabler:check" />
                    </Text>
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

export default ListboxNullOption
