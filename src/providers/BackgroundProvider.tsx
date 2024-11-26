import React from 'react'
import { usePersonalizationContext } from './PersonalizationProvider'

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
