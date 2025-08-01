import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import { Button, ModalHeader } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

import AdjustmentColumn from './components/AdjustmentColumn'
import ResultShowcase from './components/ResultShowcase'
import { BG_BLURS } from './constants/bg_blurs'

function AdjustBgImageModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('core.personalization')

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
      setValue: (value: number) => {
        setBgBlur(Object.keys(BG_BLURS)[value] as keyof typeof BG_BLURS)
      },
      labels: Object.keys(BG_BLURS),
      max: 7
    },
    {
      icon: 'tabler:sun',
      title: 'Brightness',
      value: bgBrightness,
      setValue: setBgBrightness,
      labels: ['0%', '100%', '200%'],
      max: 200
    },
    {
      icon: 'tabler:contrast',
      title: 'Contrast',
      value: bgContrast,
      setValue: setBgContrast,
      labels: ['0%', '150%', '200%'],
      max: 200
    },
    {
      icon: 'tabler:color-filter',
      title: 'Saturation',
      value: bgSaturation,
      setValue: setBgSaturation,
      labels: ['0%', '100%', '200%'],
      max: 200
    },
    {
      icon: 'tabler:layers-difference',
      title: 'Overlay Opacity',
      value: overlayOpacity,
      setValue: setOverlayOpacity,
      labels: ['0%', '50%', '100%'],
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
    <div className="min-h-0 min-h-[90vh] min-w-[40vw]">
      <ModalHeader
        icon="tabler:adjustments"
        needTranslate={false}
        title={t('bgImageSelector.modals.adjustBackground.title')}
        onClose={onClose}
      />
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <ResultShowcase
          bgBlur={bgBlur}
          bgBrightness={bgBrightness}
          bgContrast={bgContrast}
          bgSaturation={bgSaturation}
          overlayOpacity={overlayOpacity}
        />
        <div className="my-6 size-full flex-1">
          {ADJUSTMENTS_COLUMNS.map(({ title, ...props }, index) => (
            <AdjustmentColumn
              key={title}
              title={title}
              {...props}
              needDivider={index !== ADJUSTMENTS_COLUMNS.length - 1}
            />
          ))}
          <Button
            className="mt-8 w-full"
            icon="uil:save"
            onClick={onSaveChanges}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdjustBgImageModal
