import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AutoSizer } from 'react-virtualized'

import { usePersonalization } from '@lifeforge/shared'
import {
  Box,
  Button,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  Flex,
  Icon,
  Ring,
  Scrollbar,
  Stack,
  Text,
  WithQuery,
  colorWithOpacity,
  surface,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import CustomFontUploadModal from '../../../CustomFontUploadModal'

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

  const { fontFamily } = usePersonalization()

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

  const isCustomFontSelected = (fontId: string) => {
    return selectedFont === `custom:${fontId}`
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
                        <Ring
                          key={font.id}
                          asChild
                          ringColor="custom-500"
                          ringWidth={
                            isCustomFontSelected(font.id) ? '2px' : '0px'
                          }
                        >
                          <Card
                            isInteractive
                            align="center"
                            bg={surface.lightInteractive}
                            direction="row"
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedFont(`custom:${font.id}`)}
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
                            <Flex align="center" gap="md" width="100%">
                              <Flex
                                align="center"
                                bg={
                                  selectedFont === `custom:${font.id}`
                                    ? colorWithOpacity('custom-500', '10%')
                                    : { base: 'bg-200', dark: 'bg-700' }
                                }
                                flexShrink="0"
                                height="3rem"
                                justify="center"
                                r="lg"
                                width="3rem"
                              >
                                <Icon
                                  color={
                                    selectedFont === `custom:${font.id}`
                                      ? 'custom-500'
                                      : 'muted'
                                  }
                                  icon="tabler:typography"
                                  size="1.5em"
                                />
                              </Flex>
                              <Box>
                                <Text as="h3" weight="medium">
                                  {font.displayName}
                                </Text>
                                <Text as="p" color="muted" size="sm">
                                {font.family} • Weight {font.weight}
                                </Text>
                              </Box>
                            </Flex>

                            <Flex align="center" gap="md">
                              {isCustomFontSelected(font.id) && (
                                <Icon color="primary" icon="tabler:check" />
                              )}
                              <ContextMenu>
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
                            </Flex>
                          </Card>
                        </Ring>
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
