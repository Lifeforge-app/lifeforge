import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { YoutubeSummarizerControllersSchemas } from 'shared/types/controllers'

import * as YoutubeSummarizerService from '../services/youtubeSummarizer.service'

const getYoutubeVideoInfo = forgeController
  .route('GET /info/:id')
  .description('Get YouTube video information by video ID')
  .schema(
    YoutubeSummarizerControllersSchemas.YoutubeSummarizer.getYoutubeVideoInfo
  )
  .callback(
    async ({ params: { id } }) =>
      await YoutubeSummarizerService.getYoutubeVideoInfo(id)
  )

const summarizeVideo = forgeController
  .route('POST /summarize')
  .description('Summarize a YouTube video from URL')
  .schema(YoutubeSummarizerControllersSchemas.YoutubeSummarizer.summarizeVideo)
  .callback(({ body: { url }, pb }) =>
    YoutubeSummarizerService.summarizeVideo(url, pb)
  )

export default forgeRouter({
  getYoutubeVideoInfo,
  summarizeVideo
})
