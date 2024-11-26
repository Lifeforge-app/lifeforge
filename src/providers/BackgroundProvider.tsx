import React from 'react'
import { usePersonalizationContext } from './PersonalizationProvider'

function BackgroundProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const { bgImage } = usePersonalizationContext()

  return (
    <div
      className={`relative flex h-dvh w-full ${
        bgImage !== '' &&
        'bg-bg-200/80 bg-cover bg-center bg-no-repeat bg-blend-overlay dark:bg-bg-950/50'
      }`}
      style={
        bgImage !== ''
          ? {
              backgroundImage: `url(${bgImage})`
            }
          : {}
      }
    >
      <div className="flex size-full backdrop-blur-sm">{children}</div>
    </div>
  )
}

export default BackgroundProvider
