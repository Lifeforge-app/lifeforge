import opentype from 'opentype.js'

export interface FontMetadata {
  family: string
  weight: number
  style: string
}

/**
 * Detects font metadata (family name, weight, style) from a font file
 * using opentype.js to parse the font's name table and OS/2 table.
 *
 * @param fileData - The file data containing the font file
 * @returns Promise containing the detected font metadata
 */
export async function detectFontMetadata(
  fileData: File
): Promise<FontMetadata> {
  if (!fileData || !(fileData instanceof File)) {
    throw new Error('No valid file provided')
  }

  try {
    const arrayBuffer = await fileData.arrayBuffer()

    const font = opentype.parse(arrayBuffer)

    // Get font family from name table
    const family =
      font.names.fontFamily?.en ||
      font.names.fullName?.en ||
      font.names.postScriptName?.en ||
      'Unknown Font'

    // Get weight from OS/2 table (usWeightClass)
    // Default to 400 (Regular) if not available
    const weight = font.tables.os2?.usWeightClass || 400

    // Get style from name table
    const style = font.names.fontSubfamily?.en || 'Regular'

    return {
      family,
      weight,
      style
    }
  } catch (error) {
    console.error('Failed to parse font file:', error)

    throw new Error(
      'Failed to parse font file. Please ensure it is a valid font file.'
    )
  }
}
