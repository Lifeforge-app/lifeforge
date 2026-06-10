import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Ring,
  Text,
  colorWithOpacity,
  surface,
  toast,
  useModalStore,
  usePersonalization
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import type { CustomFont } from '..'
import CustomFontUploadModal from './CustomFontUploadModal'

function CustomFontCard({
  font,
  selectedFont,
  setSelectedFont
}: {
  font: CustomFont
  selectedFont: string | null
  setSelectedFont: (font: string | null) => void
}) {
  const { t } = useTranslation('common.personalization')
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const { fontFamily } = usePersonalization()

  const isSelected = selectedFont?.replace(/^custom:/, '') === font.id

  const deleteMutation = useMutation(
    forgeAPI.user.customFonts.remove
      .input({
        id: font.id
      })
      .mutationOptions({
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

  const handleDeleteClick = (font: CustomFont) => {
    open(ConfirmationModal, {
      title: t('fontFamily.customFonts.delete.title'),
      description: t('fontFamily.customFonts.delete.description'),
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)

        if (selectedFont === `custom:${font.id}`) {
          setSelectedFont(null)
        }
      }
    })
  }

  return (
    <Ring
      key={font.id}
      asChild
      ringColor="primary"
      ringWidth={isSelected ? '2px' : '0px'}
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
              selectedFont === `custom:${font.id}` ? null : `custom:${font.id}`
            )
          }
        }}
      >
        <Flex align="center" gap="md" width="100%">
          <Flex
            align="center"
            bg={
              isSelected
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
              color={isSelected ? 'custom-500' : 'muted'}
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
        <Flex align="center" gap="sm">
          {isSelected && (
            <Icon
              color="primary"
              icon="tabler:circle-check-filled"
              size="1.5em"
            />
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
  )
}

export default CustomFontCard
