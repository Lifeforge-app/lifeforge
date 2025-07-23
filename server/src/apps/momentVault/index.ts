import { forgeRouter } from '@functions/routes'

import entriesRouter from './routes/entries'
import transcriptionRouter from './routes/transcription'

export default forgeRouter({
  '/entries': entriesRouter,
  '/transcribe': transcriptionRouter
})
