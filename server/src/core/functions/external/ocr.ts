import { createWorker } from 'tesseract.js'

import { ParseOCRFunc } from '@lifeforge/server-utils'

const parseOCR: ParseOCRFunc = async imagePath => {
  const worker = await createWorker('eng', 3, {
    langPath: './src/core/models',
    cachePath: './src/core/models',
    cacheMethod: 'readOnly',
    gzip: false
  })

  try {
    const ret = await worker.recognize(imagePath)

    await worker.terminate()

    return ret.data.text
  } catch {
    await worker.terminate()
    throw new Error('Error parsing OCR')
  }
}

export default parseOCR
