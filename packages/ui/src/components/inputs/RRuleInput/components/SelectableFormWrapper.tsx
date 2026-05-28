import React from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox } from '@/components/inputs'
import { Bordered, Box, Flex, Text } from '@/components/primitives'

export function SelectableFormWrapper({
  selected,
  formId,
  onSelect,
  children
}: {
  selected: boolean
  formId: string
  onSelect: () => void
  children: React.ReactNode
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <Box position="relative" width="100%">
      <Bordered
        borderColor={
          selected ? { base: 'custom-500' } : { base: 'bg-400', dark: 'bg-700' }
        }
        borderWidth="2px"
        p="md"
        rounded="md"
        style={{
          opacity: selected ? 1 : 0.5
        }}
      >
        <Flex align="center">
          <Checkbox
            checked={selected}
            label={
              <Text color={selected ? undefined : 'muted'}>
                {t(`inputs.${formId}.title`)}
              </Text>
            }
            onCheckedChange={onSelect}
          />
        </Flex>
        <Flex align="center" gap="sm" mt="md" wrap="wrap">
          {children}
        </Flex>
      </Bordered>
      <Box
        as="button"
        inset="0"
        position="absolute"
        style={{
          opacity: selected ? 0 : 1,
          transition: 'opacity 200ms',
          zIndex: selected ? -1 : 0
        }}
        width="100%"
        onClick={onSelect}
      />
    </Box>
  )
}
