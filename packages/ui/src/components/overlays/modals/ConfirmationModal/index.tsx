import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePromiseLoading } from '@lifeforge/api'

import { Button, TextInput } from '@/components/inputs'
import { Box, Flex, Text } from '@/components/primitives'

export function ConfirmationModal({
  onClose,
  data: {
    title,
    description,
    confirmationButton = 'confirm',
    confirmationPrompt,
    onConfirm,
    onReject,
    renderChildren
  }
}: {
  onClose: () => void
  data: {
    title: string
    description: string
    confirmationButton?:
      'delete' | 'confirm' | React.ComponentProps<typeof Button>
    confirmationPrompt?: string
    onConfirm?: () => Promise<void>
    onReject?: () => void
    renderChildren?: (onClose: () => void) => React.ReactNode
  }
}) {
  const { t } = useTranslation(['common.modals', 'common.buttons'])
  const [confirmationTextState, setConfirmationTextState] = useState('')

  const handleClick = async () => {
    try {
      await onConfirm?.()
      onClose()
    } catch (error) {
      console.error('Error during confirmation:', error)
    }
  }

  const [isLoading, onClick] = usePromiseLoading(handleClick)

  return (
    <Box minWidth="40vw">
      <Text as="h1" size="2xl" weight="semibold">
        {title}
      </Text>
      <Text as="p" color="muted" mt="sm">
        {description}
      </Text>
      {confirmationPrompt && (
        <Box asChild mt="md">
          <TextInput
            icon="tabler:alert-triangle"
            label="deleteConfirmation.inputs.confirmation.label"
            namespace="common.modals"
            placeholder={t(
              [
                'common.modals:deleteConfirmation.inputs.confirmation.placeholder',
                'Type your confirmation text here'
              ],
              {
                text: confirmationPrompt
              }
            )}
            value={confirmationTextState}
            onChange={setConfirmationTextState}
          />
        </Box>
      )}
      {renderChildren?.(onClose) || (
        <Flex
          direction={{ base: 'column-reverse', md: 'row' }}
          gap="sm"
          justify="around"
          mt="xl"
          width="100%"
        >
          <Button
            flex="1"
            icon=""
            variant="secondary"
            onClick={() => {
              onClose()
              onReject?.()
            }}
          >
            Cancel
          </Button>
          {typeof confirmationButton === 'string' ? (
            <Button
              dangerous={confirmationButton === 'delete'}
              disabled={
                !!confirmationPrompt &&
                confirmationPrompt !== confirmationTextState
              }
              flex="1"
              icon={
                confirmationButton === 'delete'
                  ? 'tabler:trash'
                  : 'tabler:check'
              }
              loading={isLoading}
              style={{ width: '100%' }}
              onClick={onClick}
            >
              {confirmationButton}
            </Button>
          ) : (
            <Button
              {...confirmationButton}
              className={clsx(confirmationButton.className)}
              disabled={
                !!confirmationPrompt &&
                confirmationPrompt !== confirmationTextState
              }
              flex="1"
              loading={isLoading}
              style={{ ...confirmationButton.style }}
              onClick={onClick}
            />
          )}
        </Flex>
      )}
    </Box>
  )
}
