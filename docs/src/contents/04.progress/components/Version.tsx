import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { useState } from 'react'

import {
  Box,
  Card,
  Flex,
  Grid,
  Icon,
  Text,
  colorWithOpacity
} from '@lifeforge/ui'

dayjs.extend(weekOfYear)

function Version({
  prefix = 'dev',
  year = dayjs().year(),
  week,
  liCount,
  isLatest,
  children
}: {
  prefix?: string
  year?: number
  week: number
  liCount?: number
  isLatest: boolean
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(!isLatest)

  const version = `${prefix} ${dayjs().year(year).format('YY')}w${week.toString().padStart(2, '0')}`

  // Start from January 4th of the year (guaranteed to be in week 1 per ISO 8601)
  // then add the weeks offset
  const weekDate = dayjs(`${year}-01-04`).week(week)

  const startOfWeek = weekDate.startOf('week').format('DD MMM YYYY')

  const endOfWeek = weekDate.endOf('week').format('DD MMM YYYY')

  return (
    <Card
      id={`${prefix}-${dayjs().year(year).format('YY')}-w-${week.toString().padStart(2, '0')}`}
      p="none"
    >
      <Flex
        align="center"
        bg={{
          hover: 'bg-100',
          darkHover: colorWithOpacity('bg-800', '50%')
        }}
        gap="md"
        justify="between"
        p="md"
        style={{
          userSelect: 'none',
          transition: 'background-color 150ms ease'
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <Flex align="center" gap="md">
          <Flex
            align="center"
            bg={colorWithOpacity('bg-500', '10%')}
            color="muted"
            justify="center"
            r="lg"
            style={{
              height: '3.25rem',
              width: '3.25rem'
            }}
          >
            <Icon color="muted" icon="tabler:history" size="2rem" />
          </Flex>
          <Box>
            <Text as="h2" size={{ base: 'xl', sm: '2xl' }} weight="medium">
              {version}
            </Text>
            <Text color="muted" size="sm">
              {liCount} entries
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="sm">
          <Text color="muted" display={{ base: 'none', sm: 'block' }} size="sm">
            {startOfWeek} - {endOfWeek}
          </Text>
          <Icon
            color="muted"
            icon="tabler:chevron-down"
            size="1.25rem"
            style={{
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 500ms ease'
            }}
          />
        </Flex>
      </Flex>
      <Grid
        px="md"
        style={{
          gridTemplateRows: collapsed ? '0fr' : '1fr',
          transition: 'grid-template-rows 200ms ease'
        }}
      >
        <Box minHeight="0" style={{ clipPath: 'inset(0)' }}>
          <Box pb="xl">{children}</Box>
        </Box>
      </Grid>
    </Card>
  )
}

export default Version
