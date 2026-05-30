import React from 'react'

import { useMainSidebarState } from '@lifeforge/shared'
import { Button, Flex, Text } from '@lifeforge/ui'

function SaveButtonPopup({
  canChange,
  setCanChange
}: {
  canChange: boolean
  setCanChange: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { sidebarExpanded } = useMainSidebarState()

  if (!canChange) return null

  return (
    <Flex
      centered
      shadow
      bg={{ base: 'bg-100', dark: 'bg-900' }}
      bottom="1.5em"
      gap="md"
      left="50%"
      p="md"
      position="absolute"
      r="lg"
      style={{
        transform: 'translateX(-50%)'
      }}
      zIndex="50"
    >
      <Text as="p" className="font-medium" weight="medium">
        You are editing dashboard layout
      </Text>
      <Button icon="tabler:device-floppy" onClick={() => setCanChange(false)}>
        Save
      </Button>
    </Flex>
  )
}

export default SaveButtonPopup
