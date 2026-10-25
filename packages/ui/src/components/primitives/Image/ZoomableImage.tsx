import { useState } from 'react'
import Zoom, { type UncontrolledProps } from 'react-medium-image-zoom'

import { Image, type ImageProps } from './Image'

export type ZoomableImageProps = ImageProps & {
  /** Source used for the zoomed image. Defaults to `src`. */
  zoomSrc?: string
  /** Space between the zoomed image and the viewport edge. Defaults to 40. */
  zoomMargin?: number
  /** Additional props forwarded to `react-medium-image-zoom`. */
  zoomProps?: Omit<UncontrolledProps, 'children' | 'zoomMargin'>
}

export function ZoomableImage({
  zoomSrc,
  zoomMargin = 40,
  zoomProps,
  ...imageProps
}: ZoomableImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const failed = failedSrc !== null && failedSrc === imageProps.src

  if (!imageProps.src) {
    return <Image {...imageProps} />
  }

  if (failed) {
    return <Image {...imageProps} src={undefined} />
  }

  const { zoomImg, ...restZoomProps } = zoomProps ?? {}

  return (
    <Zoom
      zoomImg={{
        alt: imageProps.alt,
        src: zoomSrc ?? imageProps.src,
        ...zoomImg
      }}
      zoomMargin={zoomMargin}
      {...restZoomProps}
    >
      <Image
        {...imageProps}
        onError={event => {
          setFailedSrc(imageProps.src ?? null)
          imageProps.onError?.(event)
        }}
      />
    </Zoom>
  )
}
