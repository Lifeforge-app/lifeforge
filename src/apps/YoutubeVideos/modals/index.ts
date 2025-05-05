import { type ModalComponent } from '@lifeforge/ui'

import AddVideosModal from './AddVideosModal'
import DownloadProcessModal from './DownloadProcessModal'

export const YoutubeVideosModals: Record<string, ModalComponent> = {
  'youtubeVideos.addVideo': AddVideosModal,
  'youtubeVideos.downloadProcess': DownloadProcessModal
}
