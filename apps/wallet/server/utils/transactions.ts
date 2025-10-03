import { PBService } from '@functions/database'
import { fetchAI } from '@functions/external/ai'
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
