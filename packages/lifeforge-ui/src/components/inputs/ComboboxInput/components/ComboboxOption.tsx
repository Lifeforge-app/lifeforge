import { ComboboxOption as HeadlessComboboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'

import { Bordered, Box, Flex, Text } from '@components/primitives'

import { option } from './ComboboxOption.css'

function ComboboxOption({
  value,
  label,
  icon,
  iconAtEnd = false,
  color,
  noCheckmark = false
}: {
  value: unknown
  label: string | React.ReactElement
  icon?: string | React.ReactElement
  iconAtEnd?: boolean
  color?: string
  noCheckmark?: boolean
}) {
  return (
    <Flex
      asChild
      align="center"
      bg={{ hover: 'bg-200' }}
      className={option}
      gap="xl"
      justify="between"
      p="md"
      position="relative"
    >
      <HeadlessComboboxOption value={value}>
        {({ selected }: { selected: boolean }) => (
          <>
            <Text
              asChild
              color={selected ? { base: 'bg-800', dark: 'bg-100' } : undefined}
              weight={selected ? 'semibold' : undefined}
            >
              <Flex
                align="center"
                direction={iconAtEnd ? 'row-reverse' : undefined}
                gap={color === undefined ? 'sm' : undefined}
                justify={iconAtEnd ? 'between' : undefined}
                style={color !== undefined ? { gap: '0.75rem' } : undefined}
                width="100%"
              >
                {icon !== undefined ? (
                  <Box
                    as="span"
                    flexShrink="0"
                    p={color !== undefined ? 'sm' : undefined}
                    pr={color === undefined ? 'sm' : undefined}
                    rounded="md"
                    style={
                      color !== undefined
                        ? {
                            backgroundColor: color + '20',
                            color
                          }
                        : {}
                    }
                  >
                    {typeof icon === 'string' ? (
                      <Icon
                        icon={icon}
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      icon
                    )}
                  </Box>
                ) : (
                  color !== undefined && (
                    <Bordered
                      as="span"
                      display="block"
                      flexShrink="0"
                      height="1rem"
                      rounded="full"
                      style={{ backgroundColor: color }}
                      width="1rem"
                    />
                  )
                )}
                <Text truncate style={{ width: '100%', minWidth: 0 }}>
                  {label}
                </Text>
              </Flex>
            </Text>
            {!noCheckmark && selected && (
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
      </HeadlessComboboxOption>
    </Flex>
  )
}

export default ComboboxOption
