import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { usePromiseLoading } from '@lifeforge/api'
import {
  Box,
  Button,
  Card,
  Flex,
  Icon,
  Ring,
  Text,
  Transition,
  surface,
  toast
} from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'
import {
  addFontToStylesheet,
  removeFontFromStylesheet
} from '@/system/personalization/components/FontFamilySelector/components/FontFamilySelectorModal/tabs/google/utils/stylesheet'

import type { FontFamily } from '..'

function FontListItem({
  font,
  selectedFont,
  isPinned,
  setSelectedFont
}: {
  font: FontFamily
  selectedFont: string | null
  isPinned: boolean
  setSelectedFont: (font: string) => void
}) {
  const queryClient = useQueryClient()

  const togglePinMutation = useMutation(
    forgeAPI.user.personalization.toggleGoogleFontsPin.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['user', 'personalization', 'listGoogleFontsPin']
        })
      },
      onError: () => {
        toast.error('Failed to toggle font pin')
      }
    })
  )
  const [loadingPin, handleTogglePin] = usePromiseLoading(async () => {
    await togglePinMutation.mutateAsync({ family: font.family })
  })
  useEffect(() => {
    addFontToStylesheet(font)

    return () => {
      removeFontFromStylesheet(font.family)
    }
  }, [font])

  return (
    <Transition duration="150ms" property="all">
      <Ring
        asChild
        ringColor="primary"
        ringWidth={selectedFont === font.family ? '2px' : '0px'}
      >
        <Card
          as="button"
          bg={surface.lightInteractive}
          position="relative"
          onClick={() => setSelectedFont(font.family)}
        >
          <Flex
            align={{ base: 'start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            gapX="sm"
            mb="sm"
            pr="lg"
            width="100%"
          >
            <Text truncate as="h3" size="lg" weight="medium">
              {font.family}
            </Text>
            <Text as="p" color="muted" size="sm" whiteSpace="nowrap">
              ({font.variants.length} variants)
            </Text>
          </Flex>
          <Button
            icon={isPinned ? 'tabler:heart-filled' : 'tabler:heart'}
            loading={loadingPin}
            position="absolute"
            right="0.5rem"
            top="0.5rem"
            variant="plain"
            onClick={e => {
              e.stopPropagation()
              handleTogglePin()
            }}
          />
          {selectedFont === font.family && (
            <Box asChild bottom="0.5rem" position="absolute" right="0.5rem">
              <Icon
                color="primary"
                icon="tabler:circle-check-filled"
                size="1.5em"
              />
            </Box>
          )}
          <Text
            truncate
            as="p"
            mt="md"
            py="md"
            size="4xl"
            style={{ fontFamily: font.family }}
          >
            The quick brown fox jumps over the lazy dog
          </Text>
        </Card>
      </Ring>
    </Transition>
  )
}

export default FontListItem
