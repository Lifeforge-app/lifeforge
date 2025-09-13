import { Icon } from '@iconify/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { Button, GoBackButton, ModalHeader, WithQuery } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import type {
  IdeaBoxFolder,
  IdeaBoxIdea
} from '@apps/01.Productivity/ideaBox/providers/IdeaBoxProvider'

interface MoveToFolderModalProps {
  data: {
    idea: IdeaBoxIdea
  }
  onClose: () => void
}

function MoveToFolderModal({
  data: { idea },
  onClose
}: MoveToFolderModalProps) {
  const { t } = useTranslation('apps.ideaBox')

  const queryClient = useQueryClient()

  const { id: containerId, '*': currentPath } = useParams<{
    id: string
    '*': string
  }>()

  const [modalPath, setModalPath] = useState<string>(currentPath || '')

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  const foldersQuery = useQuery(
    forgeAPI.ideaBox.folders.list
      .input({
        container: containerId!,
        path: modalPath
      })
      .queryOptions({
        enabled: !!containerId
      })
  )

  const pathQuery = useQuery(
    forgeAPI.ideaBox.misc.getPath
      .input({
        container: containerId!,
        folder: modalPath.split('/').pop() || ''
      })
      .queryOptions({
        enabled: !!containerId && !!modalPath
      })
  )

  const moveToFolderMutation = useMutation(
    forgeAPI.ideaBox.ideas.moveTo
      .input({
        id: idea.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'ideas']
          })
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'misc', 'search']
          })
          toast.success('Idea moved successfully')
          onClose()
        },
        onError: error => {
          toast.error(`Failed to move idea: ${error.message}`)
        }
      })
  )

  const handleFolderClick = useCallback(
    (folder: IdeaBoxFolder) => {
      const newPath = modalPath ? `${modalPath}/${folder.id}` : folder.id

      setModalPath(newPath)
    },
    [modalPath]
  )

  const handleParentClick = useCallback(() => {
    const pathSegments = modalPath.split('/').filter(p => p)

    if (pathSegments.length > 0) {
      pathSegments.pop()
      setModalPath(pathSegments.join('/'))
    }
  }, [modalPath])

  const handleMoveToFolder = useCallback(
    (folderId: string) => {
      moveToFolderMutation.mutate({ target: folderId })
    },
    [moveToFolderMutation]
  )

  const isCurrentFolder = useCallback(
    (folderId: string) => {
      return idea.folder === folderId
    },
    [idea.folder]
  )

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        icon="tabler:folder-symlink"
        namespace="apps.ideaBox"
        title="Move to folder"
        onClose={onClose}
      />
      {modalPath && <GoBackButton onClick={handleParentClick} />}
      <div className="mt-4 mb-6 flex flex-wrap items-center gap-2">
        <button
          className="flex items-center gap-2"
          onClick={() => setModalPath('')}
        >
          <div className="flex items-center gap-2">
            <div className="dark:bg-bg-700 dark:text-bg-300 bg-bg-200 text-bg-400 shrink-0 rounded-sm p-1.5">
              <Icon icon="tabler:folder-root" />
            </div>
            <span className={clsx(!modalPath && 'font-semibold')}>Root</span>
          </div>
        </button>
        <Icon className="text-bg-500 size-4" icon="tabler:chevron-right" />
        {pathQuery.data?.route?.map((folder, index) => (
          <button
            key={index}
            className="flex items-center gap-2"
            onClick={() =>
              setModalPath(
                modalPath
                  .split('/')
                  .slice(0, index + 1)
                  .join('/')
              )
            }
          >
            <div className="flex items-center gap-2">
              <div
                className="shrink-0 rounded-sm p-1.5"
                style={{
                  backgroundColor: folder.color + '20',
                  color: folder.color
                }}
              >
                <Icon icon={folder.icon} style={{ color: folder.color }} />
              </div>
              <span
                className={clsx(
                  index === pathQuery.data!.route!.length - 1 && 'font-semibold'
                )}
              >
                {folder.name}
              </span>
            </div>
            <Icon className="text-bg-500 size-4" icon="tabler:chevron-right" />
          </button>
        ))}
      </div>
      <WithQuery query={foldersQuery}>
        {data => (
          <div className="space-y-3">
            {data.length ? (
              data.map(folder => (
                <div
                  key={folder.id}
                  className={clsx(
                    'component-bg-lighter-with-hover bg-bg-200/30 flex-between w-full cursor-pointer gap-4 rounded-lg p-2 px-4',
                    selectedFolderId === folder.id &&
                      'ring-custom-500 dark:ring-offset-bg-900 ring-offset-bg-50 ring-2 ring-offset-2'
                  )}
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <div className="flex w-full min-w-0 items-center gap-3">
                    <div
                      className="shrink-0 rounded-sm p-3"
                      style={{
                        backgroundColor: folder.color + '20',
                        color: folder.color
                      }}
                    >
                      <Icon
                        className="size-5"
                        icon={folder.icon}
                        style={{ color: folder.color }}
                      />
                    </div>
                    <div className="flex w-full min-w-0 items-start">
                      <p className="min-w-0 truncate">{folder.name}</p>
                      {isCurrentFolder(folder.id) && (
                        <span className="text-bg-500 mt-1 ml-2 block text-sm">
                          (current)
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="plain"
                    onClick={() => handleFolderClick(folder)}
                  >
                    <Icon icon="tabler:chevron-right" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-bg-500 my-4 text-center">
                {t('empty.folder.title')}
              </p>
            )}
          </div>
        )}
      </WithQuery>
      <Button
        className="mt-6 w-full"
        disabled={moveToFolderMutation.isPending || !selectedFolderId}
        onClick={() => handleMoveToFolder(selectedFolderId!)}
      >
        confirm
      </Button>
    </div>
  )
}

export default MoveToFolderModal
