import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AutoSizer } from 'react-virtualized'

import {
  Button,
  ConfirmationModal,
  EmptyStateScreen,
  Flex,
  Scrollbar,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import CustomFontCard from './components/CustomFontCard'
import CustomFontUploadModal from './components/CustomFontUploadModal'

export type CustomFont = {
  id: string
  displayName: string
  family: string
  weight: number
  file: string
  collectionId: string
}

function CustomFontSelector({
  selectedFont,
  setSelectedFont
}: {
  selectedFont: string | null
  setSelectedFont: (font: string | null) => void
}) {
  const { t } = useTranslation('common.personalization')

  const { open } = useModalStore()

  const queryClient = useQueryClient()

  const customFontsQuery = useQuery(
    forgeAPI.user.customFonts.list.queryOptions()
  )

  const deleteMutation = useMutation(
    forgeAPI.user.customFonts.remove.mutationOptions({
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

        if (selectedFont === `custom:${font.id}`) {
          setSelectedFont(null)
        }
      }
    })
  }

  return (
    <Stack flex="1" minHeight="0">
      <Button
        icon="tabler:upload"
        mb="sm"
        width="100%"
        onClick={handleUploadClick}
      >
        {t('fontFamily.buttons.uploadButton')}
      </Button>
      <WithQuery query={customFontsQuery}>
        {fonts =>
          fonts.length > 0 ? (
            <Flex direction="column" flex="1">
              <AutoSizer>
                {({ width, height }) => (
                  <Scrollbar
                    style={{
                      height: `${height}px`,
                      width: `${width}px`
                    }}
                  >
                    <Stack p="sm">
                      {fonts.map(font => (
                        <CustomFontCard
                          key={font.id}
                          font={font}
                          handleDeleteClick={handleDeleteClick}
                          selectedFont={selectedFont}
                          setSelectedFont={setSelectedFont}
                        />
                      ))}
                    </Stack>
                  </Scrollbar>
                )}
              </AutoSizer>
            </Flex>
          ) : (
            <Flex centered flex="1">
              <EmptyStateScreen
                icon="tabler:file-typography"
                message={{
                  id: 'customFont',
                  namespace: 'common.personalization',
                  tKey: 'fontFamily'
                }}
              />
            </Flex>
          )
        }
      </WithQuery>
    </Stack>
  )
}

export default CustomFontSelector
