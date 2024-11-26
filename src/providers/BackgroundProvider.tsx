import React from 'react'
import { BG_BLURS } from '@constants/bg_blurs'
import { usePersonalizationContext } from './PersonalizationProvider'

function BackgroundProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const {
    bgImage,
    backdropFilters: { brightness, blur, contrast, saturation, overlayOpacity }
  } = usePersonalizationContext()

  return (
    <div
      className={`relative isolate flex h-dvh w-full ${
        bgImage !== '' && 'bg-cover bg-center bg-no-repeat'
      }`}
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
          className="absolute left-0 top-0 z-[-1] size-full bg-bg-50 opacity-80 dark:bg-bg-950"
          style={{
            opacity: `${overlayOpacity}%`
          }}
        />
      )}
      <div
        className="flex size-full"
        style={{
          backdropFilter:
            bgImage !== ''
              ? `brightness(${brightness}%) blur(${BG_BLURS[blur]}) contrast(${contrast}%) saturate(${saturation}%)`
              : ''
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default BackgroundProvider
