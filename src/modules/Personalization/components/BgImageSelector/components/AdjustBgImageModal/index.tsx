import { usePersonalization } from '@providers/PersonalizationProvider'
import { useEffect, useState } from 'react'

import { Button, ModalHeader, ModalWrapper, Scrollbar } from '@lifeforge/ui'

import { BG_BLURS } from '../../../../../../core/providers/PersonalizationProvider/constants/bg_blurs'
import AdjustmentColumn from './components/AdjustmentColumn'
import ResultShowcase from './components/ResultShowcase'

function AdjustBgImageModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
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
      desc: 'Adjust the blur-sm of the background image',
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
      desc: 'Adjust the brightness of the background image',
      value: bgBrightness,
      setValue: setBgBrightness,
      labels: ['0%', '100%', '200%'],
      max: 200
    },
    {
      icon: 'tabler:contrast',
      title: 'Contrast',
      desc: 'Adjust the contrast of the background image',
      value: bgContrast,
      setValue: setBgContrast,
      labels: ['0%', '150%', '200%'],
      max: 200
    },
    {
      icon: 'tabler:color-filter',
      title: 'Saturation',
      desc: 'Adjust the saturation of the background image',
      value: bgSaturation,
      setValue: setBgSaturation,
      labels: ['0%', '100%', '200%'],
      max: 200
    },
    {
      icon: 'tabler:layers-difference',
      title: 'Overlay Opacity',
      desc: 'Adjust the opacity of the plain color overlay',
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
        title="Adjust Background Image"
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
          <Button className="mt-8" icon="tabler:check" onClick={onSaveChanges}>
            Save Changes
          </Button>
        </Scrollbar>
      </div>
    </ModalWrapper>
  )
}

export default AdjustBgImageModal
