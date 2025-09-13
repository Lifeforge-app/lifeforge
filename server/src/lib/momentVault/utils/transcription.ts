import fs from 'fs'
import Groq from 'groq-sdk'

export const getTranscription = async (
  filePath: string,
  apiKey: string
): Promise<string | null> => {
  const groq = new Groq({
    apiKey
  })

  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-large-v3'
  })

  return transcription.text
}
