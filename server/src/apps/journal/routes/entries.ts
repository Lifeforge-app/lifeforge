import { forgeController } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { validate } from '@utils/CRUD'
import asyncWrapper from '@utils/asyncWrapper'
import { decrypt, decrypt2, encrypt } from '@utils/encryption'
import { fetchAI } from '@utils/fetchAI'
import { getAPIKey } from '@utils/getAPIKey'
import { clientError, successWithBaseResponse } from '@utils/response'
import bcrypt from 'bcrypt'
import express, { Request, Response } from 'express'
import { body, query } from 'express-validator'
import fs from 'fs'
import PocketBase from 'pocketbase'
import wordsCount from 'words-count'
import { z } from 'zod/v4'

import { uploadMiddleware } from '../../../src/core/middleware/uploadMiddleware'
import { BaseResponse } from '../../../src/core/typescript/base_response'
import { WithoutPBDefault } from '../../../src/core/typescript/pocketbase_interfaces'
import { challenge } from '../index'
import { IJournalEntry } from '../typescript/journal_interfaces'

const router = express.Router()

async function checkMasterPassword(
  master: string,
  journalMasterPasswordHash: string
) {
  const decryptedMaster = decrypt2(master, challenge)

  const isMatch = await bcrypt.compare(
    decryptedMaster,
    journalMasterPasswordHash
  )

  if (!isMatch) {
    throw new ClientError('Invalid master password')
  }

  return decryptedMaster as string
}

async function getDecryptedMaster(
  pb: PocketBase,
  master: string
): Promise<string | null> {
  if (!pb.authStore.record) {
    throw new ClientError('authStore is not initialized')
  }

  const { journalMasterPasswordHash } = pb.authStore.record

  const [isMatched, decryptedMaster] = await checkMasterPassword(
    master,
    journalMasterPasswordHash
  )

  if (!isMatched) {
    throw new ClientError('Invalid master password')
  }

  return decryptedMaster
}

const getById = forgeController.query
  .description('Get journal entry by ID')
  .input({
    query: z.object({
      id: z.string(),
      master: z.string()
    })
  })
  .callback(async ({ query: { id, master }, pb }) => {
    const { journalMasterPasswordHash } = pb.instance.authStore.record!

    const decryptedMaster = await checkMasterPassword(
      master,
      journalMasterPasswordHash
    )

    const entries = await pb.collection('journal_entries').getOne(id)

    for (const item of ['title', 'content', 'summary', 'raw'] as (keyof Pick<
      IJournalEntry,
      'title' | 'content' | 'summary' | 'raw'
    >)[]) {
      entries[item] = decrypt(
        Buffer.from(entries[item] ?? '', 'base64'),
        decryptedMaster
      ).toString()
    }

    entries.token = await pb.files.getToken()

    successWithBaseResponse(res, entries)
  })

router.get(
  '/valid/:id',
  asyncWrapper(async (req, res) => validate(req, res, 'journal_entries'))
)

router.get(
  '/list',
  [query('master').exists().notEmpty()],
  asyncWrapper(async (req, res) => {
    const { pb } = req

    const master = decodeURIComponent((req.query.master as string) ?? '')

    if (pb.authStore.record === null) {
      clientError(res, 'authStore is not initialized')

      return
    }

    const { journalMasterPasswordHash } = pb.authStore.record

    const [isMatched, decryptedMaster] = await checkMasterPassword(
      master,
      journalMasterPasswordHash
    )

    if (!isMatched) {
      clientError(res, 'Invalid master password')

      return
    }

    const journals: IJournalEntry[] = await pb
      .collection('journal_entries')
      .getFullList({
        sort: '-date'
      })

    for (const journal of journals) {
      journal.title = decrypt(
        Buffer.from(journal.title, 'base64'),
        decryptedMaster
      ).toString()

      journal.wordCount = wordsCount(journal.content)

      journal.content = decrypt(
        Buffer.from(journal.summary ?? '', 'base64'),
        decryptedMaster
      ).toString()

      delete journal.summary
      delete journal.raw
    }

    successWithBaseResponse(res, journals)
  })
)

router.post(
  '/create',
  uploadMiddleware,
  asyncWrapper(async (req, res: Response<BaseResponse<IJournalEntry>>) => {
    const { pb } = req

    const { data } = req.body

    const files = req.files as Express.Multer.File[]

    if (!pb.authStore.record) {
      clientError(res, 'authStore is not initialized')

      for (const file of files) {
        fs.unlinkSync(file.path)
      }

      return
    }

    const { journalMasterPasswordHash } = pb.authStore.record

    if (!data) {
      clientError(res, 'data is required')

      for (const file of files) {
        fs.unlinkSync(file.path)
      }

      return
    }

    let { title, date, raw, cleanedUp, summarized, mood, master } = JSON.parse(
      decrypt2(data, challenge)
    )

    master = decrypt2(master, challenge)

    const isMatch = await bcrypt.compare(master, journalMasterPasswordHash)

    if (!isMatch) {
      clientError(res, 'Invalid master password')

      for (const file of files) {
        fs.unlinkSync(file.path)
      }

      return
    }

    title = decrypt2(title, master)
    raw = decrypt2(raw, master)
    cleanedUp = decrypt2(cleanedUp, master)
    summarized = decrypt2(summarized, master)
    mood = JSON.parse(decrypt2(mood, master))

    const newEntry: Omit<WithoutPBDefault<IJournalEntry>, 'photos'> & {
      photos: File[]
    } = {
      date,
      title: encrypt(Buffer.from(title), master).toString('base64'),
      raw: encrypt(Buffer.from(raw), master).toString('base64'),
      content: encrypt(Buffer.from(cleanedUp), master).toString('base64'),
      summary: encrypt(Buffer.from(summarized), master).toString('base64'),
      mood,
      photos: files.map(
        file => new File([fs.readFileSync(file.path)], file.originalname)
      )
    }

    const entry: IJournalEntry = await pb
      .collection('journal_entries')
      .create(newEntry)

    for (const file of files) {
      fs.unlinkSync(file.path)
    }

    successWithBaseResponse(res, entry)
  })
)

router.put(
  '/update/:id',
  uploadMiddleware,
  asyncWrapper(async (req, res: Response<BaseResponse<IJournalEntry>>) => {
    const { pb } = req

    const { data } = req.body

    const files = req.files as Express.Multer.File[]

    const { id } = req.params

    if (!pb.authStore.record) {
      clientError(res, 'authStore is not initialized')

      for (const file of files) {
        fs.unlinkSync(file.path)
      }

      return
    }

    const { journalMasterPasswordHash } = pb.authStore.record

    if (!data) {
      clientError(res, 'data is required')

      for (const file of files) {
        fs.unlinkSync(file.path)
      }

      return
    }

    let { title, date, raw, cleanedUp, summarized, mood, master } = JSON.parse(
      decrypt2(data, challenge)
    )

    master = decrypt2(master, challenge)

    const isMatch = await bcrypt.compare(master, journalMasterPasswordHash)

    if (!isMatch) {
      clientError(res, 'Invalid master password')

      for (const file of files) {
        fs.unlinkSync(file.path)
      }

      return
    }

    title = decrypt2(title, master)
    raw = decrypt2(raw, master)
    cleanedUp = decrypt2(cleanedUp, master)
    summarized = decrypt2(summarized, master)
    mood = JSON.parse(decrypt2(mood, master))

    const oldEntry: IJournalEntry = await pb
      .collection('journal_entries')
      .getOne(id)

    const newEntry: Omit<WithoutPBDefault<IJournalEntry>, 'photos'> & {
      photos?: File[]
    } = {
      date,
      title: encrypt(Buffer.from(title), master).toString('base64'),
      raw: encrypt(Buffer.from(raw), master).toString('base64'),
      content: encrypt(Buffer.from(cleanedUp), master).toString('base64'),
      summary: encrypt(Buffer.from(summarized), master).toString('base64'),
      mood,
      ...(files.length > 0 && oldEntry.photos.length === 0
        ? {
            photos: files.map(
              file => new File([fs.readFileSync(file.path)], file.originalname)
            )
          }
        : {})
    }

    const entry: IJournalEntry = await pb
      .collection('journal_entries')
      .update(id, newEntry)

    for (const file of files) {
      fs.unlinkSync(file.path)
    }

    successWithBaseResponse(res, entry)
  })
)

router.delete(
  '/delete/:id',
  asyncWrapper(async (req, res) => {
    const { id } = req.params

    const { pb } = req

    await pb.collection('journal_entries').delete(id)

    successWithBaseResponse(res, 'entries deleted')
  })
)

router.post(
  '/ai/title',
  [body('text').exists().notEmpty(), body('master').exists().notEmpty()],
  asyncWrapper(async (req, res) => {
    const key = await getAPIKey('groq', req.pb)

    if (!key) {
      clientError(res, 'API key not found')

      return
    }

    const { text } = req.body

    const decryptedMaster = await getDecryptedMaster(req, res)

    if (!decryptedMaster) return

    const rawText = decrypt2(text, decryptedMaster)

    const prompt = `This text is a journal entries. Please give me a suitable title for this journal, highlighting the stuff that happended that day. The title should not be longer than 10 words. The result should be yeilded in the language being used in the original text without any form of language translation. For example, if the original text is written in Simplified Chinese, the title should be in Simplified Chinese as well. If applicable, give the title in title case, which means the first letter of each word should be in uppercase, and lowercase otherwise. The response should contains ONLY the title, without any other unrelated text, especially those that are in the beginning of the response, like "Here is the..." or "The title is...".
        
        ${rawText}
        `

    const title = await fetchAI({
      provider: 'groq',
      apiKey: key,
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    successWithBaseResponse(res, title)
  })
)

router.post(
  '/ai/cleanup',
  [body('text').exists().notEmpty(), body('master').exists().notEmpty()],
  asyncWrapper(async (req, res) => {
    const key = await getAPIKey('groq', req.pb)

    if (!key) {
      clientError(res, 'API key not found')

      return
    }

    const { text } = req.body

    const decryptedMaster = await getDecryptedMaster(req, res)

    if (!decryptedMaster) return

    const rawText = decrypt2(text, decryptedMaster)

    const prompt = `The text below is a diary entries. Turn the text into grammatically correct and well-punctuated paragraphs, maintaining a natural flow with proper paragraph breaks. The result should be yeilded in the language being used in the original text without any form of language translation. For example, if the original text is written in Simplified Chinese, the cleaned up version of the text should be in Simplified Chinese as well. DO NOT add or remove anything from the original text. The diary content should be all normal paragraphs WITHOUT any headings or titles. Focus solely on the diary content itself. Omit any text like "Here is the...", headings like "Diary entries", or closing remarks.
        
        ${rawText}
        `

    const cleanedup = await fetchAI({
      provider: 'groq',
      apiKey: key,
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    successWithBaseResponse(res, cleanedup)
  })
)

router.post(
  '/ai/summarize',
  [body('text').exists().notEmpty(), body('master').exists().notEmpty()],
  asyncWrapper(async (req, res) => {
    const key = await getAPIKey('groq', req.pb)

    if (!key) {
      clientError(res, 'API key not found')

      return
    }

    const { text } = req.body

    const decryptedMaster = await getDecryptedMaster(req, res)

    if (!decryptedMaster) return

    const rawText = decrypt2(text, decryptedMaster)

    const prompt = `Below is a diary entries. Summarize the diary in first person perspective into a single paragraph, not more than three sentences and 50 words, capturing the main idea and key details. All the pronounces should be "I". The result should be yeilded in the language being used in the original text without any form of language translation. For example, if the original text is written in Simplified Chinese, the summary should be in Simplified Chinese as well.The response should be just the summarized paragraph itself. Omit any greetings like "Here is the...", headings like "Diary entries", or closing remarks.
        
        ${rawText}
        `

    const summarized = await fetchAI({
      provider: 'groq',
      apiKey: key,
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    successWithBaseResponse(res, summarized)
  })
)

router.post(
  '/ai/mood/',
  [body('text').exists().notEmpty(), body('master').exists().notEmpty()],
  asyncWrapper(
    async (
      req: Request,
      res: Response<BaseResponse<IJournalEntry['mood']>>
    ) => {
      const key = await getAPIKey('groq', req.pb)

      if (!key) {
        clientError(res, 'API key not found')

        return
      }

      const { text } = req.body

      const decryptedMaster = await getDecryptedMaster(req, res)

      if (!decryptedMaster) return

      const rawText = decrypt2(text, decryptedMaster)

      const prompt = `Below is a diary entries. Use a word to describe the mood of the author, and give a suitable unicode emoji icon for the mood. The word should be in full lowercase, and do not use the word "reflective". The emoji icon should be those in the emoji keyboard of modern phone. The response should be a JSON object, with the key being "text" and "emoji". Make sure to wrap the emoji icon in double quote. Do not wrap the JSON in a markdown code environment, and make sure that the response can be parsed straightaway by javascript's JSON.parse() function.
        
        ${rawText}
        `

      const MAX_RETRY = 5

      let tries = 0

      while (tries < MAX_RETRY) {
        try {
          const response = await fetchAI({
            provider: 'groq',
            apiKey: key,
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })

          if (response === null) throw new Error('null')

          const mood: IJournalEntry['mood'] = JSON.parse(response)

          successWithBaseResponse(res, mood)

          break
        } catch {
          tries++
        }
      }
    }
  )
)

export default router
