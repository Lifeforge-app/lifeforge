import { useTranslation } from 'react-i18next'

import { NumberInput } from '@/components/inputs'
import { Box, Flex, Text } from '@/components/primitives'

import type { FreqSpecificParams } from '../..'
import { SelectableFormWrapper } from '../SelectableFormWrapper'
import { MonthlyExactDateForm } from './components/MonthlyExactDateForm'
import { MonthlyRelativeDayForm } from './components/MonthlyRelativeDayForm'

export function MonthlyForm({
  data,
  setData
}: {
  data: FreqSpecificParams['monthly']
  setData: (data: FreqSpecificParams['monthly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  const forms = [
    {
      id: 'exactDate',
      icon: 'tabler:calendar',
      component: <MonthlyExactDateForm data={data} setData={setData} />
    },
    {
      id: 'relativeDay',
      icon: 'tabler:calendar',
      component: <MonthlyRelativeDayForm data={data} setData={setData} />
    }
  ] as const

  return (
    <Flex direction="column" gap="md" width="100%">
      <Flex align="center" gap="md" width="100%">
        <Box flex="1">
          <NumberInput
            icon="tabler:repeat"
            label={t('inputs.monthly.inputs.every')}
            value={data.every}
            onChange={every => setData({ ...data, every })}
          />
        </Box>
        <Text color="muted">{t('inputs.monthly.inputs.months')}</Text>
      </Flex>
      {forms.map(form => (
        <SelectableFormWrapper
          key={form.id}
          formId={`monthly.${form.id}`}
          selected={data.type === form.id}
          onSelect={() => {
            setData({ ...data, type: form.id })
          }}
        >
          {form.component}
        </SelectableFormWrapper>
      ))}
    </Flex>
  )
}
