import forgeAPI from '@/utils/forgeAPI'
import { useQueryClient } from '@tanstack/react-query'
import { FAB, ModuleHeader } from 'lifeforge-ui'
import { useCallback, useRef } from 'react'
import { type Id, toast } from 'react-toastify'
import { type SocketEvent, useSocketContext } from 'shared'

import ActionMenu from './components/ActionMenu'
import UploadTabButton from './components/UploadTabButton'

function Header({
  totalItems,
  setGuitarWorldModalOpen
}: {
  totalItems: number | undefined
  setGuitarWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const socket = useSocketContext()

  const queryClient = useQueryClient()

  const toastId = useRef<Id>(null)

  const uploadFiles = useCallback(async () => {
    const input = document.createElement('input')

    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.mp3,.mscz'

    input.onchange = async e => {
      const files = (e.target as HTMLInputElement).files

      if (files === null) {
        return
      }

      if (files.length > 100) {
        toast.error('You can only upload 100 files at a time!')

        return
      }

      try {
        const taskId = await forgeAPI.scoresLibrary.entries.upload.mutate({
          files: Array.from(files)
        })

        socket.on(
          'taskPoolUpdate',
          (
            data: SocketEvent<
              undefined,
              {
                left: number
                total: number
              }
            >
          ) => {
            if (!data || data.taskId !== taskId) return

            if (data.status === 'failed') {
              toast.done(toastId.current!)
              console.error(data.error)
              toastId.current = null
              setTimeout(() => toast.error('Failed to upload scores!'), 100)

              return
            }

            if (data.status === 'running') {
              if (toastId.current === null) {
                toastId.current = toast('Upload in Progress', {
                  progress: 0,
                  autoClose: false
                })
              }

              toast.update(toastId.current, {
                progress:
                  (data.progress!.total - data.progress!.left) /
                  data.progress!.total
              })
            }

            if (data.status === 'completed') {
              toast.done(toastId.current!)
              toastId.current = null
              queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
            }
          }
        )
      } catch (error) {
        console.error(error)
        toast.done(toastId.current!)
        setTimeout(() => toast.error('Failed to upload scores'), 100)
      }
    }
    input.click()
  }, [socket, queryClient])

  return (
    <>
      <ModuleHeader
        actionButton={
          <UploadTabButton
            setGuitarWorldModalOpen={setGuitarWorldModalOpen}
            uploadFiles={uploadFiles}
          />
        }
        contextMenuProps={{
          classNames: {
            wrapper: 'flex md:hidden'
          },
          children: <ActionMenu />
        }}
        tips="If you want to append audio and Musescore files to your music scores, make sure to name them the same as the PDF file and upload them together."
        totalItems={totalItems}
      />
      <FAB icon="tabler:plus" onClick={uploadFiles} />
    </>
  )
}

export default Header
