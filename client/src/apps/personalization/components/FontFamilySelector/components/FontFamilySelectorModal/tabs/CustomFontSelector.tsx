import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  Scrollbar,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { type InferOutput, usePersonalization } from 'shared'

import CustomFontUploadModal from '../../CustomFontUploadModal'

export type CustomFont = InferOutput<
  typeof forgeAPI.user.customFonts.list
>[number]

function CustomFontSelector({
  selectedFont,
  setSelectedFont
}: {
  selectedFont: string | null
  setSelectedFont: (font: string | null) => void
}) {
  const { t } = useTranslation('apps.personalization')

  const { fontFamily } = usePersonalization()

  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const customFontsQuery = useQuery(
    forgeAPI.user.customFonts.list.queryOptions()
  )

  const deleteMutation = useMutation(
    forgeAPI.user.customFonts.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['user', 'customFonts', 'list']
        })
        toast.success('Custom font deleted successfully!')
      },
      onError: () => {
        toast.error('Failed to delete custom font')
      }
    })
  )

  const handleUploadClick = () => {
    open(CustomFontUploadModal, {
      openType: 'create'
    })
  }

  const handleDeleteClick = (font: CustomFont) => {
    open(ConfirmationModal, {
      title: t('fontFamily.customFonts.delete.title'),
      description: t('fontFamily.customFonts.delete.description'),
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({ id: font.id })

        // If the deleted font was selected, clear selection
        if (selectedFont === `custom:${font.id}`) {
          setSelectedFont(null)
        }
      }
    })
  }

  const isCustomFontSelected = (fontId: string) => {
    return selectedFont === `custom:${fontId}`
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <Button
        className="mb-4 w-full"
        icon="tabler:upload"
        onClick={handleUploadClick}
      >
        {t('fontFamily.buttons.uploadButton')}
      </Button>
      <WithQuery query={customFontsQuery}>
        {fonts =>
          fonts.length > 0 ? (
            <Scrollbar className="flex-1">
              <div className="space-y-3 p-2">
                {fonts.map(font => (
                  <Card
                    key={font.id}
                    isInteractive
                    className={`component-bg-lighter-with-hover flex-between relative ${
                      isCustomFontSelected(font.id)
                        ? 'ring-custom-500 ring-2'
                        : ''
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setSelectedFont(
                        selectedFont === `custom:${font.id}`
                          ? null
                          : `custom:${font.id}`
                      )
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedFont(
                          selectedFont === `custom:${font.id}`
                            ? null
                            : `custom:${font.id}`
                        )
                      }
                    }}
                  >
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="dark:bg-bg-700/50 shadow-custom bg-bg-200 flex size-12 shrink-0 items-center justify-center rounded-lg">
                        <Icon
                          className="text-bg-500 size-6"
                          icon="tabler:typography"
                        />
                      </div>
                      <div className="flex-between w-full gap-8">
                        <div>
                          <p className="font-medium">{font.displayName}</p>
                          <p className="text-bg-500 text-sm">
                            {font.family} • Weight {font.weight}
                          </p>
                        </div>
                        {isCustomFontSelected(font.id) && (
                          <Icon
                            className="text-custom-500 mr-2 size-5 shrink-0"
                            icon="tabler:check"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ContextMenu
                        classNames={{
                          wrapper: 'sm:static absolute top-2 right-2'
                        }}
                      >
                        <ContextMenuItem
                          icon="tabler:pencil"
                          label="Edit"
                          onClick={() => {
                            open(CustomFontUploadModal, {
                              openType: 'edit',
                              initialData: font
                            })
                          }}
                        />
                        <ContextMenuItem
                          dangerous
                          disabled={fontFamily === `custom:${font.id}`}
                          icon="tabler:trash"
                          label="Delete"
                          onClick={() => handleDeleteClick(font)}
                        />
                      </ContextMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </Scrollbar>
          ) : (
            <div className="flex-center flex-1">
              <EmptyStateScreen
                icon="tabler:file-typography"
                message={{
                  id: 'customFont',
                  namespace: 'apps.personalization',
                  tKey: 'fontFamily'
                }}
              />
            </div>
          )
        }
      </WithQuery>
    </div>
  )
}

export default CustomFontSelector
