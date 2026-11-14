import { useState } from 'react'
import Zoom, { type UncontrolledProps } from 'react-medium-image-zoom'

import { Box } from '../Box'
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
  src,
  alt,
  fit,
  fallback,
  objectPosition,
  loading,
  decoding,
  crossOrigin,
  fetchPriority,
  referrerPolicy,
  sizes,
  srcSet,
  bg,
  onLoad,
  onError,
  ...frameProps
}: ZoomableImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const failed = failedSrc !== null && failedSrc === src

  const { zoomImg, ...restZoomProps } = zoomProps ?? {}

  const image = (
    <Image
      alt={alt}
      bg={bg}
      crossOrigin={crossOrigin}
      decoding={decoding}
      fallback={fallback}
      fetchPriority={fetchPriority}
      fit={fit}
      height="100%"
      loading={loading}
      objectPosition={objectPosition}
      referrerPolicy={referrerPolicy}
      sizes={sizes}
      src={failed ? undefined : src}
      srcSet={srcSet}
      width="100%"
      onError={event => {
        setFailedSrc(src ?? null)
        onError?.(event)
      }}
      onLoad={onLoad}
    />
  )

  return (
    <Box bg={bg} overflow="hidden" {...frameProps}>
      {!src || failed ? (
        image
      ) : (
        <Zoom
          zoomImg={{
            alt,
            src: zoomSrc ?? src,
            ...zoomImg
          }}
          zoomMargin={zoomMargin}
          {...restZoomProps}
        >
          {image}
        </Zoom>
      )}
    </Box>
  )
}
