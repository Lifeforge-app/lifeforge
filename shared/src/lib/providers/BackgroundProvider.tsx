import clsx from 'clsx'

import { usePersonalization } from './PersonalizationProvider'
import { BG_BLURS } from './PersonalizationProvider/constants/bg_blurs'

function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const {
    bgImage,
    derivedTheme,
    backdropFilters: { brightness, blur, contrast, saturation, overlayOpacity }
  } = usePersonalization()

  return (
    <div
      className={clsx(
        'relative isolate flex h-dvh w-full',
        bgImage !== '' && 'has-bg-image bg-cover bg-center bg-no-repeat'
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
          className="absolute top-0 left-0 z-[-1] size-full"
          style={{
            backgroundColor: `color-mix(in oklab, var(--color-bg-${
              derivedTheme === 'dark' ? '950' : '50'
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
