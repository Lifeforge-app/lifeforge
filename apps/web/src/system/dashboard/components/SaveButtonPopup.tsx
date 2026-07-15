import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Flex, Icon, Stack, Text } from '@lifeforge/ui'

function SaveButtonPopup({
  canChange,
  setCanChange
}: {
  canChange: boolean
  setCanChange: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { t } = useTranslation('common.dashboard')

  if (!canChange) return null

  return (
    <Flex
      centered
      shadow
      bg={{ base: 'bg-50', dark: 'bg-800' }}
      bottom="1.5em"
      direction={{ base: 'column', sm: 'row' }}
      gap="md"
      left="50%"
      p="md"
      position="absolute"
      r="lg"
      style={{
        transform: 'translateX(-50%)'
      }}
      width={{ base: '90%', sm: 'auto' }}
      zIndex="50"
    >
      <Flex align="center" gap="md">
        <Icon color="muted" icon="tabler:pencil" size="2em" />
        <Stack>
          <Text as="p" weight="medium" whiteSpace="nowrap">
            {t('messages.editingLayout')}
          </Text>
          <Text as="p" color="muted" pr="lg" size="sm">
            {t('messages.editingLayoutHint')}
          </Text>
        </Stack>
      </Flex>
      <Button
        icon="tabler:device-floppy"
        width={{ base: '100%', sm: 'auto' }}
        onClick={() => setCanChange(false)}
      >
        Save
      </Button>
    </Flex>
  )
}

export default SaveButtonPopup
