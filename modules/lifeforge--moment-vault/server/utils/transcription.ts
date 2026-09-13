import fs from 'fs'
import OpenAI from 'openai'

export const getTranscription = async (
  filePath: string,
  apiKey: string
): Promise<string | null> => {
  const openai = new OpenAI({
    apiKey
  })

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1'
  })

  return transcription.text
}
