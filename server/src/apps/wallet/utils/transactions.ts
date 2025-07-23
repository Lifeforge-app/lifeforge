import { PBService } from '@functions/database'
import { fetchAI } from '@functions/external/ai'
import fs from 'fs'
import { fromPath } from 'pdf2pic'
import z from 'zod'

export async function getTransactionDetails(OCRResult: string, pb: PBService) {
  const TransactionDetails = z.object({
    date: z.string(),
    particulars: z.string(),
    type: z.union([z.literal('income'), z.literal('expenses')]),
    amount: z.number()
  })

  const completion = await fetchAI({
    pb,
    provider: 'openai',
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          "Extract the following details from the text: date (in the format YYYY-MM-DD), particulars (e.g. what this transaction is about, e.g. Lunch, Purchase of <books, groceries,mineral water,etc>, Reload of xxx credit, etc. @ <Location(if applicable)>, don't list out the purchased item), type (income or expenses), and amount (without currency)."
      },
      {
        role: 'user',
        content: OCRResult
      }
    ],
    structure: TransactionDetails
  })

  if (!completion) {
    throw new Error('Failed to extract transaction details')
  }

  return completion
}

export function convertPDFToImage(path: string): Promise<File | undefined> {
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

          const thumbnailFile = new File(
            [responseBuffer.buffer],
            `receipt.png`,
            {
              type: 'image/png'
            }
          )

          resolve(thumbnailFile)

          fs.unlinkSync(path)
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}
