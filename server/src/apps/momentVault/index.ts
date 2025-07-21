import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './controllers/entries'
import transcriptionRouter from './controllers/transcription'

export default forgeRouter({
  '/entries': entriesRouter,
  '/transcribe': transcriptionRouter
})
