import { usePersonalization } from '@providers/PersonalizationProvider'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ModalHeader, ModalWrapper, Scrollbar } from '@lifeforge/ui'

import { BG_BLURS } from '../../../../../../providers/PersonalizationProvider/constants/bg_blurs'
import AdjustmentColumn from './components/AdjustmentColumn'
import ResultShowcase from './components/ResultShowcase'

function AdjustBgImageModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { t } = useTranslation('core.personalization')
  const { setBackdropFilters, backdropFilters } = usePersonalization()
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
    setBackdropFilters({
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
  }, [isOpen])

  return (
    <ModalWrapper isOpen={isOpen} minHeight="90vh" minWidth="40vw">
      <ModalHeader
        icon="tabler:adjustments"
        needTranslate={false}
        title={t('bgImageSelector.modals.adjustBackground.title')}
        onClose={onClose}
      />
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <ResultShowcase
          bgBlur={bgBlur}
          bgBrightness={bgBrightness}
          bgContrast={bgContrast}
          bgSaturation={bgSaturation}
          overlayOpacity={overlayOpacity}
        />
        <Scrollbar className="mt-6 size-full flex-1">
          {ADJUSTMENTS_COLUMNS.map(({ title, ...props }, index) => (
            <AdjustmentColumn
              key={title}
              title={title}
              {...props}
              needDivider={index !== ADJUSTMENTS_COLUMNS.length - 1}
            />
          ))}
          <Button className="mt-8" icon="uil:save" onClick={onSaveChanges}>
            Save
          </Button>
        </Scrollbar>
      </div>
    </ModalWrapper>
  )
}

export default AdjustBgImageModal
