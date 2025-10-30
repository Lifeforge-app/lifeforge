import { cropImageToPolygon } from './polygonCropUtils'

/**
 * Crop an image to a polygon's exact shape and return as data URL
 */
export async function cropPolygonImage(
  imageUrl: string,
  coordinates: [number, number][]
): Promise<string> {
  const canvas = await cropImageToPolygon(imageUrl, coordinates)

  // Convert to data URL
  return canvas.toDataURL('image/png')
}
