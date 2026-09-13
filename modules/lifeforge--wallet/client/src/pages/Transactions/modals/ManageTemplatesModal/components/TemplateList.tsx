import { useEffect } from 'react'
import { AutoSizer } from 'react-virtualized'

import type { InferOutput } from '@lifeforge/api'
import { Box, EmptyStateScreen, Flex, Scrollbar, Stack } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { TemplatesTabbedView } from '../constants/tabbed_view'
import TemplateItem from './Templateitem'

function TemplateList({
  templates,
  choosing,
  onClose
}: {
  templates: InferOutput<typeof forgeAPI.templates.list>
  choosing: boolean | undefined
  onClose: () => void
}) {
  const { currentTab, setAmounts } = TemplatesTabbedView.useContext()

  useEffect(() => {
    if (!templates) return

    setAmounts({
      income: templates.income.length,
      expenses: templates.expenses.length
    })
  }, [templates?.income?.length, templates?.expenses?.length, setAmounts])

  if (templates[currentTab].length === 0) {
    return (
      <Flex centered flex="1">
        <EmptyStateScreen
          icon="tabler:template-off"
          message={{
            id: 'templates'
          }}
        />
      </Flex>
    )
  }

  return (
    <Box flex="1" height="100%" mt="md">
      <AutoSizer>
        {({ width, height }) => (
          <Scrollbar style={{ width, height }}>
            <Stack>
              {templates[currentTab].map(template => (
                <TemplateItem
                  key={template.id}
                  choosing={!!choosing}
                  template={template}
                  onClose={onClose}
                />
              ))}
            </Stack>
          </Scrollbar>
        )}
      </AutoSizer>
    </Box>
  )
}

export default TemplateList
