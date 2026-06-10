import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ModalHeader, Stack, usePersonalization } from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

import AdjustmentColumn from './components/AdjustmentColumn'
import ResultShowcase from './components/ResultShowcase'
import { BG_BLURS } from './constants/bg_blurs'

function AdjustBgImageModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.personalization')
  const { backdropFilters } = usePersonalization()
  const { changeBackdropFilters } = useUserPersonalization()
  const [bgBlur, setBgBlur] = useState<keyof typeof BG_BLURS>(
    backdropFilters.blur
  )
  const [bgBrightness, setBgBrightness] = useState(backdropFilters.brightness)
  const [overlayOpacity, setOverlayOpacity] = useState(
    backdropFilters.overlayOpacity
  )
  const [bgContrast, setBgContrast] = useState(backdropFilters.contrast)
  const [bgSaturation, setBgSaturation] = useState(backdropFilters.saturation)

  const ADJUSTMENTS_COLUMNS = [
    {
      icon: 'tabler:blur',
      title: 'Blur',
      value: Object.keys(BG_BLURS).indexOf(bgBlur),
      onChange: (value: number) => {
        setBgBlur(Object.keys(BG_BLURS)[value] as keyof typeof BG_BLURS)
      },
      max: 7
    },
    {
      icon: 'tabler:sun',
      title: 'Brightness',
      value: bgBrightness,
      onChange: setBgBrightness,
      max: 200
    },
    {
      icon: 'tabler:contrast',
      title: 'Contrast',
      value: bgContrast,
      onChange: setBgContrast,
      max: 200
    },
    {
      icon: 'tabler:color-filter',
      title: 'Saturation',
      value: bgSaturation,
      onChange: setBgSaturation,
      max: 200
    },
    {
      icon: 'tabler:layers-difference',
      title: 'Overlay Opacity',
      value: overlayOpacity,
      onChange: setOverlayOpacity,
      max: 100
    }
  ]

  function onSaveChanges() {
    changeBackdropFilters({
      ...backdropFilters,
      blur: bgBlur,
      brightness: bgBrightness,
      contrast: bgContrast,
      saturation: bgSaturation,
      overlayOpacity
    })
    onClose()
  }

  useEffect(() => {
    setBgBlur(backdropFilters.blur)
    setBgBrightness(backdropFilters.brightness)
    setOverlayOpacity(backdropFilters.overlayOpacity)
    setBgContrast(backdropFilters.contrast)
    setBgSaturation(backdropFilters.saturation)
  }, [])

  return (
    <Stack gap="none" minWidth="40vw">
      <ModalHeader
        icon="tabler:adjustments"
        title={t('bgImageSelector.modals.adjustBackground.title')}
        onClose={onClose}
      />
      <ResultShowcase
        bgBlur={bgBlur}
        bgBrightness={bgBrightness}
        bgContrast={bgContrast}
        bgSaturation={bgSaturation}
        overlayOpacity={overlayOpacity}
      />
      <Stack gap="md" mt="lg" px="xs" width="100%">
        {ADJUSTMENTS_COLUMNS.map(({ title, ...props }) => (
          <AdjustmentColumn key={title} title={title} {...props} />
        ))}
        <Button icon="uil:save" mt="lg" width="100%" onClick={onSaveChanges}>
          Save
        </Button>
      </Stack>
    </Stack>
  )
}

export default AdjustBgImageModal
