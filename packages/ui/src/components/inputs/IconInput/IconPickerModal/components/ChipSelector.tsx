import { useCallback, useMemo, useState } from 'react'

import { TagChip } from '@/components/display'
import { Flex, Icon, Text, Transition } from '@/components/primitives'
import { usePersonalization } from '@/providers'

export function ChipSelector({
  options,
  value,
  onChange
}: {
  options: string[]
  value: string | null
  onChange: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [expanded, setExpanded] = useState(false)
  const { derivedThemeColor } = usePersonalization()

  const sortedOptions = useMemo(
    () =>
      [...options].sort((a, b) => {
        if (a[0] === b[0]) return a.length - b.length

        return a.localeCompare(b)
      }),
    [options]
  )
  const handleChipClick = useCallback(
    (option: string) => {
      onChange(value === option ? null : option)
      setExpanded(false)
    },
    [onChange, value]
  )

  return options.length > 0 ? (
    <Flex align="center" gap="sm" mt="md">
      <Flex
        gap="sm"
        overflow={expanded ? undefined : 'hidden'}
        overflowX={expanded ? undefined : 'auto'}
        pb="xs"
        width="100%"
        wrap={expanded ? 'wrap' : undefined}
      >
        {sortedOptions.map(option => (
          <TagChip
            key={option}
            color={value === option ? derivedThemeColor : undefined}
            flexShrink="0"
            label={option}
            onClick={() => handleChipClick(option)}
          />
        ))}
      </Flex>
      <Flex
        align="center"
        bg={{ base: 'transparent', hover: 'bg-100', darkHover: 'bg-800' }}
        flexGrow="1"
        flexShrink="0"
        height="2rem"
        justify="center"
        px="sm"
        r="full"
      >
        <Text
          asChild
          as="button"
          color={{ base: 'bg-500', hover: 'bg-800', darkHover: 'bg-100' }}
          size="sm"
          wrap="nowrap"
          onClick={() => {
            setExpanded(!expanded)
          }}
        >
          <Transition property="transform">
            <Icon
              icon="uil:angle-up"
              style={{
                height: '1.5rem',
                width: '1.5rem',
                transform: expanded ? 'rotate(180deg)' : undefined
              }}
            />
          </Transition>
        </Text>
      </Flex>
    </Flex>
  ) : (
    <></>
  )
}
