import { usePersonalization } from '@lifeforge/shared'
import {
  Box,
  Card,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Ring,
  Text,
  colorWithOpacity,
  surface,
  useModalStore
} from '@lifeforge/ui'

import type { CustomFont } from '..'
import CustomFontUploadModal from './CustomFontUploadModal'

function CustomFontCard({
  font,
  selectedFont,
  handleDeleteClick,
  setSelectedFont
}: {
  font: CustomFont
  selectedFont: string | null
  handleDeleteClick: (font: CustomFont) => void
  setSelectedFont: (font: string | null) => void
}) {
  const { open } = useModalStore()

  const { fontFamily } = usePersonalization()

  return (
    <Ring
      key={font.id}
      asChild
      ringColor="custom-500"
      ringWidth={font.id === selectedFont ? '2px' : '0px'}
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
                selectedFont === `custom:${font.id}` ? 'custom-500' : 'muted'
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
          {font.id === selectedFont && (
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
  )
}

export default CustomFontCard
