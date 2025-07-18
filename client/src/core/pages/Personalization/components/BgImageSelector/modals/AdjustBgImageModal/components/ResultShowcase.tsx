import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { usePersonalization } from 'shared/lib'

import { BG_BLURS } from '../constants/bg_blurs'

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
}) {
  const { bgImage } = usePersonalization()

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
          className="bg-bg-50 dark:bg-bg-950 absolute top-0 left-0 z-[-1] size-full"
          style={{
            opacity: `${overlayOpacity}%`
          }}
        />
        <div
          className={clsx(
            'shadow-custom component-bg flex size-full flex-col gap-3 rounded-lg p-4'
          )}
        >
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <Icon className="size-8 shrink-0" icon="tabler:box" />
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-bg-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac.
          </p>
          <div className="flex gap-3">
            <div
              className={clsx(
                'component-bg-lighter flex w-full flex-col items-start gap-3 rounded-lg p-4 sm:flex-row sm:items-center'
              )}
            >
              <span className="bg-custom-500/20 text-custom-500 block rounded-md p-4">
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
