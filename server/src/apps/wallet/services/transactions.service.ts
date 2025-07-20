import { fetchAI } from '@functions/fetchAI'
import parseOCR from '@functions/parseOCR'
import fs from 'fs'
import { fromPath } from 'pdf2pic'
import Pocketbase from 'pocketbase'
import { z } from 'zod'

import { ISchemaWithPB } from 'shared/types/collections'
import { WalletCollectionsSchemas } from 'shared/types/collections'
import { WalletControllersSchemas } from 'shared/types/controllers'

function convertPDFToImage(path: string): Promise<File | undefined> {
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

export const getAllTransactions = async (
  pb: Pocketbase
): Promise<
  WalletControllersSchemas.ITransactions['getAllTransactions']['response']
> => {
  const incomeExpensesTransactions = await pb
    .collection('wallet__transactions_income_expenses')
    .getFullList<
      ISchemaWithPB<WalletCollectionsSchemas.ITransactionsIncomeExpense> & {
        expand: {
          base_transaction: ISchemaWithPB<WalletCollectionsSchemas.ITransaction>
        }
      }
    >({
      expand: 'base_transaction'
    })

  const transferTransactions = await pb
    .collection('wallet__transactions_transfer')
    .getFullList<
      ISchemaWithPB<WalletCollectionsSchemas.ITransactionsTransfer> & {
        expand: {
          base_transaction: ISchemaWithPB<WalletCollectionsSchemas.ITransaction>
        }
      }
    >({
      expand: 'base_transaction'
    })

  const allTransactions: WalletControllersSchemas.ITransactions['getAllTransactions']['response'] =
    []

  for (const transaction of incomeExpensesTransactions) {
    const baseTransaction = transaction.expand.base_transaction

    allTransactions.push({
      ...baseTransaction,
      type: transaction.type,
      particulars: transaction.particulars,
      asset: transaction.asset,
      category: transaction.category,
      ledgers: transaction.ledgers,
      location_name: transaction.location_name,
      location_coords: transaction.location_coords
    })
  }

  for (const transaction of transferTransactions) {
    const baseTransaction = transaction.expand.base_transaction

    allTransactions.push({
      ...baseTransaction,
      type: 'transfer',
      from: transaction.from,
      to: transaction.to
    })
  }

  return allTransactions.sort((a, b) => {
    if (new Date(a.date).getTime() === new Date(b.date).getTime()) {
      return new Date(a.created).getTime() - new Date(b.created).getTime()
    }

    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export const createTransaction = async (
  pb: Pocketbase,
  data: WalletControllersSchemas.ITransactions['createTransaction']['body'],
  file: Express.Multer.File | undefined
): Promise<
  WalletControllersSchemas.ITransactions['createTransaction']['response']
> => {
  let targetFile: Express.Multer.File | File | undefined = file
  let receipt: File | undefined = undefined

  if (targetFile)
    targetFile.originalname = decodeURIComponent(targetFile.originalname)

  const path = file?.originalname.split('/') ?? []

  const fileName = path.pop()

  if (file?.originalname.endsWith('.pdf')) {
    targetFile = await convertPDFToImage(file.path)
  }

  if (targetFile instanceof File) {
    receipt = targetFile
  } else if (targetFile && fs.existsSync(targetFile.path)) {
    const fileBuffer = fs.readFileSync(targetFile.path)

    receipt = new File([fileBuffer], fileName ?? 'receipt.jpg', {
      type: targetFile.mimetype
    })
  }

  const baseTransaction = await pb
    .collection('wallet__transactions')
    .create<ISchemaWithPB<WalletCollectionsSchemas.ITransaction>>({
      type: data.type === 'transfer' ? 'transfer' : 'income_expenses',
      amount: data.amount,
      date: data.date,
      receipt
    })

  if (data.type === 'transfer') {
    await pb
      .collection('wallet__transactions_transfer')
      .create<ISchemaWithPB<WalletCollectionsSchemas.ITransactionsTransfer>>({
        from: data.from,
        to: data.to,
        base_transaction: baseTransaction.id
      })
  } else {
    await pb
      .collection('wallet__transactions_income_expenses')
      .create<
        ISchemaWithPB<WalletCollectionsSchemas.ITransactionsIncomeExpense>
      >({
        base_transaction: baseTransaction.id,
        type: data.type,
        particulars: data.particulars,
        asset: data.asset,
        category: data.category,
        ledgers: data.ledgers,
        location_name: data.location?.name ?? '',
        location_coords: {
          lon: data.location?.location.longitude ?? 0,
          lat: data.location?.location.latitude ?? 0
        }
      })
  }
}

export const updateTransaction = async (
  pb: Pocketbase,
  id: string,
  data: WalletControllersSchemas.ITransactions['updateTransaction']['body'],
  file: Express.Multer.File | undefined
): Promise<
  WalletControllersSchemas.ITransactions['updateTransaction']['response']
> => {
  let targetFile: Express.Multer.File | File | undefined = file
  let receipt: File | undefined = undefined

  if (!data.toRemoveReceipt) {
    if (targetFile)
      targetFile.originalname = decodeURIComponent(targetFile.originalname)

    const path = file?.originalname.split('/') ?? []

    const fileName = path.pop()

    if (file?.originalname.endsWith('.pdf')) {
      targetFile = await convertPDFToImage(file.path)
    }

    if (targetFile instanceof File) {
      receipt = targetFile
    } else if (targetFile && fs.existsSync(targetFile.path)) {
      const fileBuffer = fs.readFileSync(targetFile.path)

      receipt = new File([fileBuffer], fileName ?? 'receipt.jpg', {
        type: targetFile.mimetype
      })
    }
  }

  const baseTransaction = await pb
    .collection('wallet__transactions')
    .update<ISchemaWithPB<WalletCollectionsSchemas.ITransaction>>(id, {
      type: data.type === 'transfer' ? 'transfer' : 'income_expenses',
      amount: data.amount,
      date: data.date,
      ...(!data.toRemoveReceipt && { receipt })
    })

  if (data.type === 'transfer') {
    const target = await pb
      .collection('wallet__transactions_transfer')
      .getFirstListItem(`base_transaction = '${id}'`)

    await pb
      .collection('wallet__transactions_transfer')
      .update<
        ISchemaWithPB<WalletCollectionsSchemas.ITransactionsTransfer>
      >(target.id, {
        from: data.from,
        to: data.to,
        base_transaction: baseTransaction.id
      })
  } else {
    const target = await pb
      .collection('wallet__transactions_income_expenses')
      .getFirstListItem(`base_transaction = '${id}'`)

    await pb
      .collection('wallet__transactions_income_expenses')
      .update<
        ISchemaWithPB<WalletCollectionsSchemas.ITransactionsIncomeExpense>
      >(target.id, {
        base_transaction: baseTransaction.id,
        type: data.type,
        particulars: data.particulars,
        asset: data.asset,
        category: data.category,
        ledgers: data.ledgers,
        location_name: data.location?.name ?? '',
        location_coords: {
          lon: data.location?.location.longitude ?? 0,
          lat: data.location?.location.latitude ?? 0
        }
      })
  }
}

export const deleteTransaction = async (
  pb: Pocketbase,
  id: string
): Promise<void> => {
  await pb.collection('wallet__transactions').delete(id)
}

export const scanReceipt = async (
  pb: Pocketbase,
  file: Express.Multer.File
): Promise<WalletCollectionsSchemas.IWalletReceiptScanResult> => {
  async function getTransactionDetails(): Promise<WalletCollectionsSchemas.IWalletReceiptScanResult> {
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

  if (file.originalname.endsWith('.pdf')) {
    const image = await convertPDFToImage(file.path)

    if (!image) {
      throw new Error('Failed to convert PDF to image')
    }

    const buffer = await image.arrayBuffer()

    fs.writeFileSync('medium/receipt.png', Buffer.from(buffer))
  } else {
    fs.renameSync(file.path, 'medium/receipt.png')
  }

  if (!fs.existsSync('medium/receipt.png')) {
    throw new Error('Receipt image not found')
  }

  const OCRResult = await parseOCR('medium/receipt.png')

  if (!OCRResult) {
    throw new Error('OCR parsing failed')
  }

  fs.unlinkSync('medium/receipt.png')

  const transaction = await getTransactionDetails()

  return transaction
}
