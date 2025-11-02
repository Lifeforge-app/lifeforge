import Tesseract from 'tesseract.js'

import { cropImageToPolygon } from './polygonCropUtils'

/**
 * Crop an image to a polygon's exact shape and perform OCR
 */
export async function performOCROnPolygon(
  imageUrl: string,
  coordinates: [number, number][],
  onProgress?: (progress: number) => void,
  options?: {
    preprocess?: boolean // Convert to black and white with increased contrast
  }
): Promise<string> {
  // Get the cropped canvas
  const canvas = await cropImageToPolygon(imageUrl, coordinates)

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Preprocess image for better OCR if enabled
  if (options?.preprocess) {
    const processedImageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    )

    const data = processedImageData.data

    // Convert to grayscale and increase contrast
    for (let i = 0; i < data.length; i += 4) {
      // Convert to grayscale using luminosity formula
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]

      // Apply gentle contrast enhancement for low-res images
      const contrastFactor = 1.3 // Gentler contrast (1.0 = no change, >1 = more contrast)

      const contrastedGray = ((gray / 255 - 0.5) * contrastFactor + 0.5) * 255

      // Apply adaptive threshold to convert to pure black and white
      const threshold = 140 // Higher threshold for better text extraction on low-res images

      const bw = contrastedGray > threshold ? 255 : 0

      // Set RGB channels to the black/white value
      data[i] = bw // Red
      data[i + 1] = bw // Green
      data[i + 2] = bw // Blue
      // Alpha channel (i + 3) remains unchanged
    }

    // Clear canvas and draw processed image
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.putImageData(processedImageData, 0, 0)
  }

  // Convert to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob'))
        }
      },
      'image/png',
      1.0
    )
  })

  // Perform OCR
  const worker = await Tesseract.createWorker('eng', 1, {
    logger: m => {
      if (onProgress && m.status === 'recognizing text') {
        onProgress(m.progress)
      }
    }
  })

  const {
    data: { text }
  } = await Tesseract.recognize(blob)

  await worker.terminate()

  // Clean up the text
  const cleanedText = text
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')

  return cleanedText
}

/**
 * Batch OCR for multiple polygons
 */
export async function performBatchOCR(
  imageUrl: string,
  polygons: Array<{ id: string; coordinates: [number, number][] }>,
  onProgress?: (current: number, total: number, unitId: string) => void
): Promise<Map<string, string>> {
  const results = new Map<string, string>()

  const worker = await Tesseract.createWorker('eng')

  for (let i = 0; i < polygons.length; i++) {
    const polygon = polygons[i]

    try {
      if (onProgress) {
        onProgress(i + 1, polygons.length, polygon.id)
      }

      const text = await performOCROnPolygon(imageUrl, polygon.coordinates)

      results.set(polygon.id, text)
    } catch (error) {
      console.error(`OCR failed for polygon ${polygon.id}:`, error)
      results.set(polygon.id, '')
    }
  }

  await worker.terminate()

  return results
}
