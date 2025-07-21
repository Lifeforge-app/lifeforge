import forgeRouter from '@functions/forgeRouter'

import youtubeSummarizerRouter from './controllers/youtubeSummarizer'

export default forgeRouter({
  '/': youtubeSummarizerRouter
})
