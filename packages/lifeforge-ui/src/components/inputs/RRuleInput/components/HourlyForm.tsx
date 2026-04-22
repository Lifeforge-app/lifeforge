import { useTranslation } from 'react-i18next'

import { NumberInput } from '@components/inputs'
import { Box, Flex, Text } from '@components/primitives'

import type { FreqSpecificParams } from '../RRuleInput'

function HourlyForm({
  data,
  setData
}: {
  data: FreqSpecificParams['hourly']
  setData: (data: FreqSpecificParams['hourly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <Flex align="center" gap="md" width="100%">
      <Box flex="1">
        <NumberInput
          required
          icon="tabler:repeat"
          label={t('inputs.hourly.inputs.every')}
          value={data.every}
          onChange={every => setData({ ...data, every })}
        />
      </Box>
      <Text color="muted">{t('inputs.hourly.inputs.hours')}</Text>
    </Flex>
  )
}

export default HourlyForm
