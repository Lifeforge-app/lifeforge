import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { Box, Card } from '@lifeforge/ui'

import EventDetails from '@/components/Calendar/components/EventDetails'
import { useInternalCategories } from '@/hooks/useInternalCategories'
import { forgeAPI } from '@/manifest'

import type { CalendarCategory, CalendarEvent } from '../..'

function AgendaEventItem({ event }: { event: CalendarEvent }) {
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())
  const { map: internalCategoryMap } = useInternalCategories()

  const category = useMemo(() => {
    if (event.category.startsWith('_')) {
      return (internalCategoryMap[event.category] ?? {}) as
        CalendarCategory | undefined
    }

    return categoriesQuery.data?.find(
      category => category.id === event.category
    )
  }, [categoriesQuery, event.category, internalCategoryMap])

  return (
    <Card
      align="center"
      direction="row"
      gap="md"
      minWidth="24rem"
      position="relative"
    >
      <Box
        height="calc(100% - 2rem)"
        left="1rem"
        position="absolute"
        r="full"
        style={{
          backgroundColor: category?.color
        }}
        top="1rem"
        width="0.25rem"
      />
      <Box flex="1" ml="xl">
        <EventDetails category={category} event={event} />
      </Box>
    </Card>
  )
}

export default AgendaEventItem
