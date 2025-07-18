import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { YoutubeSummarizerControllersSchemas } from 'shared/types/controllers'

import * as YoutubeSummarizerService from '../services/youtubeSummarizer.service'

const youtubeSummarizerRouter = express.Router()

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

bulkRegisterControllers(youtubeSummarizerRouter, [
  getYoutubeVideoInfo,
  summarizeVideo
])

export default youtubeSummarizerRouter
