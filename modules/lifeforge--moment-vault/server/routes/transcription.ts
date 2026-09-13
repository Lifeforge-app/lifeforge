import fs from 'fs'
import request from 'request'
import z from 'zod'

import forge from '../forge'
import momentVaultSchemas from '../schema'
import { convertToMp3 } from '../utils/convertToMP3'
import { getTranscription } from '../utils/transcription'

export const transcribeExisted = forge
  .mutation({
    description: 'Transcribe an existing audio entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: z.string(),
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      query: { id },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const apiKey = await getAPIKey('openai', pb)

      if (!apiKey) {
        return response.badRequest('API key not found')
      }

      const entry = await pb.getOne.collection('entries').id(id).execute()

      if (!entry.file) {
        return response.badRequest('No audio file found in entry')
      }

      const fileURL = pb.instance.files.getURL(entry, entry.file[0])

      try {
        let filePath = `medium/${fileURL.split('/').pop()}`

        const fileStream = fs.createWriteStream(filePath)

        request(fileURL).pipe(fileStream)

        await new Promise(resolve => {
          fileStream.on('finish', () => {
            resolve(null)
          })
        })

        if (!filePath.endsWith('.mp3')) {
          const mp3Path = await convertToMp3(filePath)

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }

          filePath = mp3Path
        }

        const transcriptionText = await getTranscription(filePath, apiKey)

        if (!transcriptionText) {
          return response.badRequest('Transcription failed')
        }

        await pb.update
          .collection('entries')
          .id(id)
          .data({
            transcription: transcriptionText
          })
          .execute()

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }

        return response.ok(transcriptionText)
      } catch (err) {
        console.error('Error during transcription:', err)

        return response.badRequest('Failed to transcribe audio file')
      } finally {
        const filePath = `medium/${fileURL.split('/').pop()}`

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
    }
  )

export const transcribeNew = forge
  .mutation({
    description: 'Transcribe a new audio file',
    media: {
      file: {
        optional: false
      }
    },
    output: {
      OK: z.string(),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      pb,
      media: { file },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      if (!file || typeof file === 'string') {
        return response.badRequest('No file uploaded')
      }

      if (file.mimetype !== 'audio/mp3') {
        file.path = await convertToMp3(file.path)
      }

      const apiKey = await getAPIKey('openai', pb)

      if (!apiKey) {
        return response.badRequest('API key not found')
      }

      const transcriptionText = await getTranscription(file.path, apiKey)

      if (!transcriptionText) {
        return response.badRequest('Transcription failed')
      }

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }

      return response.ok(transcriptionText)
    }
  )

export const updateTranscription = forge
  .mutation({
    description: 'Update transcription of an audio entry',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        transcription: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: momentVaultSchemas.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body: { transcription }, response }) =>
    response.ok(
      await pb.update
        .collection('entries')
        .id(id)
        .data({
          transcription
        })
        .execute()
    )
  )

export const cleanupTranscription = forge
  .mutation({
    description: 'Clean up and improve transcription text',
    input: {
      query: z.object({
        id: z.string(),
        newText: z.string().optional()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: z.string(),
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      query: { id, newText },
      core: {
        api: { getAPIKey, fetchAI }
      },
      response
    }) => {
      const apiKey = await getAPIKey('openai', pb)

      if (!apiKey) {
        return response.badRequest('API key not found')
      }

      let textToCleanUp: string

      if (!newText) {
        const entry = await pb.getOne.collection('entries').id(id).execute()

        if (!entry.transcription) {
          return response.badRequest('No transcription data to clean up')
        }

        textToCleanUp = entry.transcription
      } else {
        textToCleanUp = newText
      }

      const aiResponse = await fetchAI({
        provider: 'openai',
        model: 'gpt-4o-mini',
        pb,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert text cleaner. Your task is to clean up the provided transcription text by adding appropriate punctuation, fixing grammatical errors, and improving overall readability. Ensure the cleaned transcription maintains the original wordings and meaning while enhancing its clarity and flow.'
          },
          {
            role: 'user',
            content: `Please clean up the following transcription:\n\n${textToCleanUp}`
          }
        ],
        structure: z.object({
          cleanedTranscription: z.string()
        })
      })

      if (!aiResponse || !aiResponse.cleanedTranscription) {
        return response.badRequest('Failed to clean up transcription')
      }

      return response.ok(aiResponse.cleanedTranscription)
    }
  )
