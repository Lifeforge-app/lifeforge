import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import fs from 'fs'
import request from 'request'
import { z } from 'zod/v4'

import { convertToMp3 } from '../utils/convertToMP3'
import { getTranscription } from '../utils/transcription'

const transcribeExisted = forgeController.mutation
  .description('Transcribe an existing audio entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'moment_vault__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const apiKey = await getAPIKey('groq', pb)

    if (!apiKey) {
      throw new ClientError('API key not found')
    }

    const entry = await pb.getOne
      .collection('moment_vault__entries')
      .id(id)
      .execute()

    if (!entry.file) {
      throw new ClientError('No audio file found in entry')
    }

    const fileURL = pb.instance.files.getURL(entry, entry.file[0])

    try {
      const filePath = `medium/${fileURL.split('/').pop()}`

      const fileStream = fs.createWriteStream(filePath)

      request(fileURL).pipe(fileStream)

      await new Promise(resolve => {
        fileStream.on('finish', () => {
          resolve(null)
        })
      })

      const response = await getTranscription(filePath, apiKey)

      if (!response) {
        throw new Error('Transcription failed')
      }

      await pb.update
        .collection('moment_vault__entries')
        .id(id)
        .data({
          transcription: response
        })
        .execute()

      return response
    } catch (err) {
      console.error('Error during transcription:', err)
      throw new Error('Failed to transcribe audio file')
    } finally {
      const filePath = `medium/${fileURL.split('/').pop()}`

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }
  })

const transcribeNew = forgeController.mutation
  .description('Transcribe a new audio file')
  .input({})
  .media({
    file: {
      optional: false
    }
  })
  .callback(async ({ pb, media: { file } }) => {
    if (!file || typeof file === 'string') {
      throw new ClientError('No file uploaded')
    }

    if (file.mimetype !== 'audio/mp3') {
      file.path = await convertToMp3(file.path)
    }

    const apiKey = await getAPIKey('groq', pb)

    if (!apiKey) {
      throw new ClientError('API key not found')
    }

    const response = await getTranscription(file.path, apiKey)

    if (!response) {
      throw new Error('Transcription failed')
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }

    return response
  })

export default forgeRouter({
  transcribeExisted,
  transcribeNew
})
