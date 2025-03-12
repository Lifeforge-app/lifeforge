import clsx from 'clsx'
import React from 'react'

import { BG_BLURS } from '../constants/bg_blurs'
import { usePersonalization } from './PersonalizationProvider'

function BackgroundProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const {
    bgImage,
    theme,
    backdropFilters: { brightness, blur, contrast, saturation, overlayOpacity }
  } = usePersonalization()

  return (
    <div
      className={clsx(
        'relative isolate flex h-dvh w-full',
        bgImage !== '' && 'bg-cover bg-center bg-no-repeat'
      )}
      style={
        bgImage !== ''
          ? {
              backgroundImage: `url(${bgImage})`
            }
          : {}
      }
    >
      {bgImage !== '' && (
        <div
          className="absolute left-0 top-0 z-[-1] size-full"
          style={{
            backgroundColor: `color-mix(in oklab, var(--color-bg-${
              (theme === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches) ||
              theme === 'dark'
                ? '950'
                : '50'
            }) ${overlayOpacity}%, transparent)`,
            backdropFilter:
              bgImage !== ''
                ? `brightness(${brightness}%) blur(${BG_BLURS[blur]}) contrast(${contrast}%) saturate(${saturation}%)`
                : ''
          }}
        />
      )}

      {children}
    </div>
  )
}

export default BackgroundProvider
