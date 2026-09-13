import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  CheckboxField,
  FormModal,
  ListboxField,
  Stack,
  Text,
  createDefaultValues
} from '@lifeforge/ui'

import { type SpendingHeatmapPreferences } from '../providers/SpendingHeatmapProvider'

const schema = z.object({
  metric: z.enum(['amount', 'count']),
  showHeatmap: z.boolean(),
  showMarkers: z.boolean()
})

function HeatmapControlsModal({
  onClose,
  data
}: {
  onClose: () => void
  data: {
    preferences: SpendingHeatmapPreferences
    setPreferences: (preferences: SpendingHeatmapPreferences) => void
    isZoomedIn: boolean
  }
}) {
  const { t } = useModuleTranslation()

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...data.preferences
    },
    resolver: zodResolver(schema)
  })

  const watchShowHeatmap = useWatch({
    control: form.control,
    name: 'showHeatmap'
  })

  const metricOptions = useMemo(
    () => [
      {
        value: 'amount' as const,
        text: t('spendingHeatmap.controls.byAmount'),
        icon: 'tabler:currency-dollar'
      },
      {
        value: 'count' as const,
        text: t('spendingHeatmap.controls.byCount'),
        icon: 'tabler:hash'
      }
    ],
    [t]
  )

  return (
    <FormModal
      form={form}
      submissionConfig={{
        label: 'save',
        icon: 'tabler:device-floppy',
        handler: async values => {
          data.setPreferences(values)
        }
      }}
      uiConfig={{
        icon: 'tabler:adjustments',
        namespace: false,
        title: t('spendingHeatmap.controls.title'),
        onClose
      }}
    >
      <Stack gap="md">
        <ListboxField
          control={form.control}
          icon="tabler:adjustments"
          label={t('spendingHeatmap.controls.metric')}
          name="metric"
          namespace={false}
          options={metricOptions}
        />
        <Stack gap="sm">
          <Text color="bg-600">{t('spendingHeatmap.controls.layers')}</Text>
          <CheckboxField
            control={form.control}
            icon="tabler:map"
            label={t('spendingHeatmap.controls.showHeatmap')}
            name="showHeatmap"
            namespace={false}
          />
          {data.isZoomedIn && watchShowHeatmap && (
            <Text
              color="bg-500"
              style={{ marginTop: '-4px', paddingLeft: '2.25rem' }}
            >
              {t('spendingHeatmap.controls.autoHiddenZoom')}
            </Text>
          )}
          <CheckboxField
            control={form.control}
            icon="tabler:map-pin"
            label={t('spendingHeatmap.controls.showMarkers')}
            name="showMarkers"
            namespace={false}
          />
        </Stack>
      </Stack>
    </FormModal>
  )
}

export default HeatmapControlsModal
