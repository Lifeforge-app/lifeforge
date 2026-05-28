import { useTranslation } from 'react-i18next'

import { NumberInput } from '@components/inputs'
import { Box, Flex, Text } from '@components/primitives'

import type { FreqSpecificParams } from '..'

export function DailyForm({
  data,
  setData
}: {
  data: FreqSpecificParams['daily']
  setData: (data: FreqSpecificParams['daily']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <Flex align="center" gap="md" width="100%">
      <Box flex="1">
        <NumberInput
          required
          icon="tabler:repeat"
          label={t('inputs.daily.inputs.every')}
          value={data.every}
          onChange={every => setData({ ...data, every })}
        />
      </Box>
      <Text color="muted">{t('inputs.daily.inputs.days')}</Text>
    </Flex>
  )
}
