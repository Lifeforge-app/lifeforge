import { fromPath } from 'pdf2pic'

export default function convertPDFToImage(
  path: string
): Promise<File | undefined> {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        density: 200,
        quality: 100,
        saveFilename: 'receipt',
        savePath: 'medium',
        format: 'png',
        width: 2000,
        preserveAspectRatio: true
      }

      const convert = fromPath(path, options)

      const pageToConvertAsImage = 1

      convert(pageToConvertAsImage, { responseType: 'buffer' }).then(
        responseBuffer => {
          if (!responseBuffer.buffer) {
            resolve(undefined)

            return
          }

          const arrayBuffer = responseBuffer.buffer.slice(
            responseBuffer.buffer.byteOffset,
            responseBuffer.buffer.byteOffset + responseBuffer.buffer.byteLength
          )

          const thumbnailFile = new File([arrayBuffer], `receipt.png`, {
            type: 'image/png'
          })

          resolve(thumbnailFile)
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}
