import { clsx } from 'clsx'
import { type ReactNode, useState } from 'react'

import { Box, type BoxProps } from '../Box'
import { Flex } from '../Flex'
import { imageBase, imageFill, imageFit } from './Image.css'
import { ImageFallbackLayer } from './ImageFallbackLayer'

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

export type ImageFallback = ReactNode | string

export type ImageProps = Omit<
  BoxProps<'img'>,
  'alt' | 'as' | 'asChild' | 'src'
> & {
  /** The image source. When omitted, `fallback` is rendered instead. */
  src?: string
  /** Alternative text. Use an empty string for decorative images. */
  alt: string
  /** How the image should fit inside its box. Defaults to `cover`. */
  fit?: ImageFit
  /**
   * Rendered behind the image at all times. Defaults to the `tabler:photo-off`
   * icon. It acts as a placeholder while the image loads and remains visible if
   * the image is missing or fails to load. Pass `null` to disable the fallback
   * layer. Pass a string to render another Iconify icon with the same adaptive
   * sizing, or a React element for full control.
   *
   * The image needs a sized frame (`width`/`height`/`aspectRatio`) for the
   * fallback layer to be visible.
   */
  fallback?: ImageFallback
  /** CSS `object-position` for the image. */
  objectPosition?: string
}

export function Image({
  src,
  alt,
  fit = 'cover',
  fallback = 'tabler:photo-off',
  objectPosition,
  loading = 'lazy',
  decoding = 'async',
  crossOrigin,
  fetchPriority,
  referrerPolicy,
  sizes,
  srcSet,
  bg,
  className,
  style,
  onLoad,
  onError,
  ...rest
}: ImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const failed = !src || failedSrc === src

  const fallbackContent =
    fallback === null || fallback === false ? null : (
      <ImageFallbackLayer fallback={fallback} />
    )

  if (fallbackContent === null) {
    if (failed) return null

    return (
      <Box
        alt={alt}
        as="img"
        bg={bg}
        className={clsx(imageBase, imageFit({ fit }), className)}
        crossOrigin={crossOrigin}
        decoding={decoding}
        fetchPriority={fetchPriority}
        loading={loading}
        referrerPolicy={referrerPolicy}
        sizes={sizes}
        src={src}
        srcSet={srcSet}
        style={
          objectPosition === undefined ? style : { objectPosition, ...style }
        }
        onError={event => {
          setFailedSrc(src)
          onError?.(event)
        }}
        onLoad={onLoad}
        {...rest}
      />
    )
  }

  return (
    <Box
      bg={bg ?? { base: 'bg-200', dark: 'bg-900' }}
      className={className}
      overflow="hidden"
      position="relative"
      style={{ isolation: 'isolate', ...style }}
      {...rest}
    >
      <Flex
        align="center"
        inset="0"
        justify="center"
        position="absolute"
        zIndex="-1"
      >
        {fallbackContent}
      </Flex>
      {!failed && (
        <Box
          alt={alt}
          as="img"
          className={clsx(imageBase, imageFill, imageFit({ fit }))}
          crossOrigin={crossOrigin}
          decoding={decoding}
          fetchPriority={fetchPriority}
          loading={loading}
          referrerPolicy={referrerPolicy}
          sizes={sizes}
          src={src}
          srcSet={srcSet}
          style={objectPosition === undefined ? undefined : { objectPosition }}
          onError={event => {
            setFailedSrc(src)
            onError?.(event)
          }}
          onLoad={onLoad}
        />
      )}
    </Box>
  )
}
