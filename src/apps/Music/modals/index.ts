import { ModalComponent } from '../../../core/modals/useModalStore'
import UpdateMusicModal from './UpdateMusicModal'
import YoutubeDownloaderModal from './YoutubeDownloaderModal'

export const MusicModals: Record<string, ModalComponent> = {
  'music.updateMusic': UpdateMusicModal,
  'music.youtubeDownloader': YoutubeDownloaderModal
}
