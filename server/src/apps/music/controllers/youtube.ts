import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { MusicControllersSchemas } from 'shared/types/controllers'

import * as YoutubeService from '../services/youtube.service'

const getVideoInfo = forgeController
  .route('GET /get-info/:id')
  .description('Get YouTube video information')
  .schema(MusicControllersSchemas.Youtube.getVideoInfo)
  .callback(async ({ params: { id } }) => await YoutubeService.getVideoInfo(id))

const downloadVideo = forgeController
  .route('POST /async-download/:id')
  .description('Download YouTube video asynchronously')
  .schema(MusicControllersSchemas.Youtube.downloadVideo)
  .callback(async ({ pb, params: { id }, body }) => {
    if (YoutubeService.getDownloadStatus().status === 'in_progress') {
      throw new Error('A download is already in progress')
    }
    YoutubeService.setDownloadStatus('in_progress')
    YoutubeService.downloadVideo(pb, id, body)

    return true
  })
  .statusCode(202)

const getDownloadStatus = forgeController
  .route('GET /download-status')
  .description('Get current download status')
  .schema(MusicControllersSchemas.Youtube.getDownloadStatus)
  .callback(async () => YoutubeService.getDownloadStatus())

export default forgeRouter({
  getVideoInfo,
  downloadVideo,
  getDownloadStatus
})
