import { ListboxOption as HeadlessListboxOption } from '@headlessui/react'
import { formatHex, parse } from 'culori'

import {
  Bordered,
  Box,
  Flex,
  Icon,
  Text,
  Transition,
  WithDivide
} from '@/components/primitives'

export function ListboxOption({
  value,
  label,
  icon,
  iconAtEnd = false,
  color,
  className,
  renderColorAndIcon,
  selected,
  onClick
}: {
  value: unknown
  label: string | React.ReactElement
  icon?: string | React.ReactElement
  iconAtEnd?: boolean
  color?: string
  className?: string
  renderColorAndIcon?: (params: {
    color?: string
    icon?: string | React.ReactElement
  }) => React.ReactNode
  selected?: boolean
  onClick?: () => void
}) {
  const convertedColor = color?.startsWith('oklch(')
    ? formatHex(parse(color))
    : color

  return (
    <WithDivide>
      <Transition>
        <Text asChild align="left">
          <Flex
            asChild
            align="center"
            bg={{ hover: 'bg-200', darkHover: 'bg-700' }}
            className={className}
            justify="between"
            minWidth="0"
            p="md"
            position="relative"
            width="100%"
          >
            <HeadlessListboxOption value={value} onClick={onClick}>
              {({ selected: innerSelected }) => {
                const finalSelected =
                  typeof selected === 'boolean' ? selected : innerSelected

                return (
                  <>
                    <Text
                      asChild
                      color={
                        finalSelected
                          ? { base: 'bg-800', dark: 'bg-100' }
                          : undefined
                      }
                      weight={finalSelected ? 'semibold' : undefined}
                    >
                      <Flex
                        align="center"
                        direction={iconAtEnd ? 'row-reverse' : undefined}
                        gap={convertedColor === undefined ? 'sm' : undefined}
                        justify={iconAtEnd ? 'between' : undefined}
                        minWidth="0"
                        style={
                          convertedColor !== undefined
                            ? { gap: '0.75rem' }
                            : undefined
                        }
                        width="100%"
                      >
                        {renderColorAndIcon ? (
                          renderColorAndIcon({ color, icon })
                        ) : icon !== undefined ? (
                          <Box
                            as="span"
                            flexShrink="0"
                            p={convertedColor !== undefined ? 'sm' : undefined}
                            pr={convertedColor === undefined ? 'sm' : undefined}
                            r="md"
                            style={
                              convertedColor !== undefined
                                ? {
                                    backgroundColor: convertedColor + '20',
                                    color: convertedColor
                                  }
                                : {}
                            }
                          >
                            {typeof icon === 'string' ? (
                              icon.startsWith('customHTML:') ? (
                                <Box
                                  as="span"
                                  dangerouslySetInnerHTML={{
                                    __html: icon.replace('customHTML:', '')
                                  }}
                                  display="block"
                                  flexShrink="0"
                                  style={{
                                    height: '1.25rem',
                                    width: '1.25rem'
                                  }}
                                />
                              ) : (
                                <Icon icon={icon} />
                              )
                            ) : (
                              icon
                            )}
                          </Box>
                        ) : (
                          convertedColor !== undefined && (
                            <Bordered
                              as="span"
                              display="block"
                              flexShrink="0"
                              height="1rem"
                              r="full"
                              style={{ backgroundColor: convertedColor }}
                              width="1rem"
                            />
                          )
                        )}
                        <Text truncate style={{ width: '100%', minWidth: 0 }}>
                          {label}
                        </Text>
                      </Flex>
                    </Text>
                    {finalSelected && (
                      <Icon color="custom-500" icon="tabler:check" size="lg" />
                    )}
                  </>
                )
              }}
            </HeadlessListboxOption>
          </Flex>
        </Text>
      </Transition>
    </WithDivide>
  )
}
