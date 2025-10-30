/**
 * Shared utility for cropping images to polygon shapes
 */

/**
 * Crop an image to a polygon's exact shape and return a canvas
 */
export async function cropImageToPolygon(
  imageUrl: string,
  coordinates: [number, number][]
): Promise<HTMLCanvasElement> {
  if (coordinates.length < 3) {
    throw new Error('Polygon must have at least 3 coordinates')
  }

  // Calculate bounding box
  const xs = coordinates.map(c => c[0])

  const ys = coordinates.map(c => c[1])

  const minX = Math.min(...xs)

  const maxX = Math.max(...xs)

  const minY = Math.min(...ys)

  const maxY = Math.max(...ys)

  const width = maxX - minX

  const height = maxY - minY

  // Add padding to capture text that might be slightly outside
  const padding = 10

  const cropX = Math.max(0, minX - padding)

  const cropY = Math.max(0, minY - padding)

  const cropWidth = width + padding * 2

  const cropHeight = height + padding * 2

  // Create a canvas to crop the image
  const canvas = document.createElement('canvas')

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Load the image
  const img = new Image()

  img.crossOrigin = 'anonymous'

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      resolve()
    }
    img.onerror = reject
    img.src = imageUrl
  })

  // Set canvas size to cropped area
  canvas.width = cropWidth
  canvas.height = cropHeight

  // Create polygon clipping path
  ctx.save()

  // Translate coordinates relative to the crop area
  ctx.beginPath()
  coordinates.forEach((coord, index) => {
    const x = coord[0] - cropX

    const y = coord[1] - cropY

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.closePath()

  // Clip to polygon shape
  ctx.clip()

  // Draw the cropped portion (only the polygon area will be visible)
  ctx.drawImage(
    img,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  )

  ctx.restore()

  // Fill areas outside polygon with white background
  const imageData = ctx.getImageData(0, 0, cropWidth, cropHeight)

  ctx.clearRect(0, 0, cropWidth, cropHeight)

  // Fill with white background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, cropWidth, cropHeight)

  // Create polygon path again for putting image data back
  ctx.save()
  ctx.beginPath()
  coordinates.forEach((coord, index) => {
    const x = coord[0] - cropX

    const y = coord[1] - cropY

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.closePath()
  ctx.clip()

  // Put the image data back (only inside polygon)
  ctx.putImageData(imageData, 0, 0)

  ctx.restore()

  return canvas
}
