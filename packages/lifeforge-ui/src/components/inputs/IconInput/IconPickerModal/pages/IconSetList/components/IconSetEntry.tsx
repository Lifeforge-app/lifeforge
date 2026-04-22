import { Icon } from '@iconify/react'
import { memo, useCallback } from 'react'

import { Card } from '@components/layout'
import { Bordered, Box, Flex, Text } from '@components/primitives'

import type { IIconSet } from '../../../typescript/icon_selector_interfaces'

function IconSetEntry({
  iconSet,
  setCurrentIconSet
}: {
  iconSet: IIconSet
  setCurrentIconSet: ({ iconSet }: { iconSet: string }) => void
}) {
  const handleClick = useCallback(() => {
    setCurrentIconSet({ iconSet: iconSet.prefix })
  }, [iconSet.prefix, setCurrentIconSet])

  return (
    <Card
      key={iconSet.prefix}
      isInteractive
      as="article"
      bg={{
        base: 'bg-100',
        hover: 'bg-200',
        dark: 'bg-800',
        darkHover: 'bg-700'
      }}
    >
      <Text asChild align="left">
        <Box as="button" type="button" width="100%" onClick={handleClick}>
          <Flex
            align="center"
            gap="lg"
            justify="center"
            py="lg"
            width="100%"
            wrap="wrap"
          >
            {iconSet.samples?.map(sampleIcon => (
              <Text
                key={sampleIcon}
                asChild
                color={{ base: 'bg-600', dark: 'bg-400' }}
                style={{ height: '2rem', width: '2rem' }}
              >
                <Icon
                  icon={`${iconSet.prefix}:${sampleIcon}`}
                  style={{ height: '2rem', width: '2rem' }}
                />
              </Text>
            ))}
          </Flex>
          <Flex direction="column" justify="between">
            <Text truncate as="h3" size="xl" weight="semibold">
              {iconSet.name}
            </Text>
            <Text truncate as="p" color="custom-500" size="sm">
              {iconSet.author.name}
            </Text>
            <Bordered
              asChild
              borderColor={{ base: 'bg-200', dark: 'bg-700' }}
              borderSide="top"
              mt="md"
              pt="md"
              style={{ fontSize: '0.875rem' }}
            >
              <Text asChild color="muted">
                <Flex align="center" justify="between">
                  <Text>{iconSet.total?.toLocaleString()} icons</Text>
                  {iconSet.height !== undefined && (
                    <Flex align="center">
                      <Icon
                        height="20"
                        icon="icon-park-outline:auto-height-one"
                        width="20"
                      />
                      <Text ml="sm">{iconSet.height}</Text>
                    </Flex>
                  )}
                </Flex>
              </Text>
            </Bordered>
          </Flex>
        </Box>
      </Text>
    </Card>
  )
}

export default memo(IconSetEntry)
