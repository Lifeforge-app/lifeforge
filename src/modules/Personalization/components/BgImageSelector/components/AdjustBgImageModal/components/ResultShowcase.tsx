import { Icon } from '@iconify/react'
import React from 'react'
import { BG_BLURS } from '@constants/bg_blurs'
import useThemeColors from '@hooks/useThemeColor'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import clsx from 'clsx'

function ResultShowcase({
  bgBrightness,
  bgBlur,
  bgContrast,
  bgSaturation,
  overlayOpacity
}: {
  bgBrightness: number
  bgBlur: keyof typeof BG_BLURS
  bgContrast: number
  bgSaturation: number
  overlayOpacity: number
}): React.ReactElement {
  const { bgImage } = usePersonalizationContext()
  const { componentBgLighter, componentBg } = useThemeColors()

  return (
    <div
      className="relative isolate max-h-72 w-full overflow-y-auto rounded-md bg-cover bg-center bg-no-repeat md:shrink-0 md:overflow-hidden"
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
          className={clsx(
            'flex size-full flex-col gap-4 rounded-lg p-4 shadow-custom',
            componentBg
          )}
        >
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <Icon className="size-8 shrink-0" icon="tabler:box" />
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-bg-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac.
          </p>
          <div className="flex gap-4">
            <div
              className={clsx(
                'flex w-full flex-col sm:flex-row items-start gap-4 rounded-lg p-4 sm:items-center',
                componentBgLighter
              )}
            >
              <span className="block rounded-md bg-custom-500/20 p-4 text-custom-500">
                <Icon className="size-8" icon="tabler:box" />
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
  )
}

export default ResultShowcase
