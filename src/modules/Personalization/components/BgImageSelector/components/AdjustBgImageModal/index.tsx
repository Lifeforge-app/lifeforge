import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import ModalHeader from '@components/Modals/ModalHeader'
import ModalWrapper from '@components/Modals/ModalWrapper'
import useThemeColors from '@hooks/useThemeColor'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

const BG_BLURS = {
  none: '0px',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px'
}

function AdjustBgImageModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}): React.ReactElement {
  const { componentBg, componentBgLighter } = useThemeColors()
  const { bgImage, setBackdropFilters, backdropFilters } =
    usePersonalizationContext()
  const [bgBlur, setBgBlur] = useState<keyof typeof BG_BLURS>(
    backdropFilters.blur
  )
  const [bgBrightness, setBgBrightness] = useState(backdropFilters.brightness)
  const [overlayOpacity, setOverlayOpacity] = useState(
    backdropFilters.overlayOpacity
  )
  const [bgContrast, setBgContrast] = useState(backdropFilters.contrast)
  const [bgSaturation, setBgSaturation] = useState(backdropFilters.saturation)

  function onSaveChanges(): void {
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
    <ModalWrapper isOpen={isOpen} minWidth="40vw" minHeight="90vh">
      <ModalHeader
        icon="tabler:adjustments"
        title="Adjust Background Image"
        onClose={onClose}
      />
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="relative isolate w-full shrink-0 overflow-hidden rounded-md bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImage})`
          }}
        >
          <div
            className="flex size-full flex-col p-8"
            style={{
              backdropFilter: `brightness(${bgBrightness}%) blur(${BG_BLURS[bgBlur]}) contrast(${bgContrast}%) saturate(${bgSaturation}%)`
            }}
          >
            <div
              className="absolute left-0 top-0 z-[-1] size-full bg-bg-50 dark:bg-bg-950"
              style={{
                opacity: `${overlayOpacity}%`
              }}
            />
            <div
              className={`flex size-full flex-col gap-4 rounded-lg p-4 shadow-custom ${componentBg}`}
            >
              <h1 className="flex items-center gap-2 text-2xl font-semibold">
                <Icon icon="tabler:box" className="size-8" />
                Lorem ipsum dolor sit amet
              </h1>
              <p className="text-bg-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                ac.
              </p>
              <div className="flex gap-4">
                <div
                  className={`flex w-full ${componentBgLighter} items-center gap-4 rounded-lg p-4`}
                >
                  <span className="block rounded-md bg-custom-500/20 p-4 text-custom-500">
                    <Icon icon="tabler:box" className="size-8" />
                  </span>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold">Lorem ipsum dolor</h2>
                    <p className="text-bg-500">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam ac.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Scrollbar className="mt-6 size-full flex-1">
          <ConfigColumn
            icon="tabler:blur"
            title="Blur"
            desc="Adjust the blur of the background image"
            hasDivider
            noDefaultBreakpoints
          >
            <div className="w-full">
              <input
                type="range"
                min={0}
                max="7"
                value={Object.keys(BG_BLURS).indexOf(bgBlur)}
                className="!range range-primary w-full bg-bg-800"
                onChange={e => {
                  setBgBlur(
                    Object.keys(BG_BLURS)[
                      parseInt(e.target.value, 10)
                    ] as keyof typeof BG_BLURS
                  )
                }}
                step={1}
              />
              <div className="mb-4 flex w-full justify-between px-2.5 text-xs">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="relative h-2 w-0.5 rounded-full bg-bg-500"
                  >
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                      {Object.keys(BG_BLURS)[index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ConfigColumn>
          <ConfigColumn
            icon="tabler:sun"
            title="Brightness"
            desc="Adjust the brightness of the background image"
            noDefaultBreakpoints
          >
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={200}
                value={bgBrightness}
                className="!range range-primary w-full bg-bg-800"
                onChange={e => {
                  setBgBrightness(parseInt(e.target.value, 10))
                }}
                step={1}
              />
              <div className="mb-4 flex w-full justify-between px-2.5 text-xs">
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    0%
                  </div>
                </div>
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    100%
                  </div>
                </div>
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    200%
                  </div>
                </div>
              </div>
            </div>
          </ConfigColumn>
          <ConfigColumn
            icon="tabler:contrast"
            title="Contrast"
            desc="Adjust the contrast of the background image"
            noDefaultBreakpoints
          >
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={200}
                value={bgContrast}
                className="!range range-primary w-full bg-bg-800"
                onChange={e => {
                  setBgContrast(parseInt(e.target.value, 10))
                }}
                step={1}
              />
              <div className="mb-4 flex w-full justify-between px-2.5 text-xs">
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    0%
                  </div>
                </div>
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    150%
                  </div>
                </div>
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    200%
                  </div>
                </div>
              </div>
            </div>
          </ConfigColumn>
          <ConfigColumn
            icon="tabler:color-filter"
            title="Saturation"
            desc="Adjust the saturation of the background image"
            noDefaultBreakpoints
          >
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={200}
                value={bgSaturation}
                className="!range range-primary w-full bg-bg-800"
                onChange={e => {
                  setBgSaturation(parseInt(e.target.value, 10))
                }}
                step={1}
              />
              <div className="mb-4 flex w-full justify-between px-2.5 text-xs">
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    0%
                  </div>
                </div>
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    100%
                  </div>
                </div>
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    200%
                  </div>
                </div>
              </div>
            </div>
          </ConfigColumn>
          <ConfigColumn
            icon="tabler:layers-difference"
            title="Overlay Opacity"
            desc="Adjust the opacity of the plain color overlay"
            noDefaultBreakpoints
            hasDivider={false}
          >
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={100}
                value={overlayOpacity}
                step={1}
                className="!range range-primary w-full bg-bg-800"
                onChange={e => {
                  setOverlayOpacity(parseFloat(e.target.value))
                }}
              />
              <div className="mb-4 flex w-full justify-between px-2.5 text-xs">
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    0%
                  </div>
                </div>
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    50%
                  </div>
                </div>
                <div className="relative h-2 w-0.5 rounded-full bg-bg-500">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                    100%
                  </div>
                </div>
              </div>
            </div>
          </ConfigColumn>
          <Button onClick={onSaveChanges} className="mt-8" icon="tabler:check">
            Save Changes
          </Button>
        </Scrollbar>
      </div>
    </ModalWrapper>
  )
}

export default AdjustBgImageModal
