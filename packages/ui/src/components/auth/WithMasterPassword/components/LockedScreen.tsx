import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { encrypt, usePromiseLoading } from '@lifeforge/api'
import type { ForgeEndpoint } from '@lifeforge/api'

import { Button, TextInput } from '@/components/inputs'
import { Box, Flex, Icon, Text } from '@/components/primitives'
import { toast } from '@/providers'

export function LockedScreen({
  challengeController,
  verifyController,
  setMasterPassword
}: {
  challengeController: ForgeEndpoint
  verifyController: ForgeEndpoint
  setMasterPassword: React.Dispatch<React.SetStateAction<string>>
}) {
  const [masterPassWordInputContent, setMasterPassWordInputContent] =
    useState<string>('')
  
const { t } = useTranslation('common.vault')

  async function handleSubmit(): Promise<void> {
    if (masterPassWordInputContent.trim() === '') {
      toast.error('Please fill in all the field')

      return
    }

    try {
      const challenge = (await challengeController.query()) as string

      const data = await verifyController.mutate({
        password: encrypt(masterPassWordInputContent, challenge)
      } as never)

      if (data === true) {
        toast.info(
          t('fetch.success', {
            action: t('fetch.unlock')
          })
        )
        setMasterPassword(masterPassWordInputContent)
        setMasterPassWordInputContent('')
      } else {
        toast.error(
          t('fetch.failure', {
            action: t('fetch.unlock')
          })
        )
      }
    } catch {
      toast.error(
        t('fetch.failure', {
          action: t('fetch.unlock')
        })
      )
    }
  }

  const [loading, onSubmit] = usePromiseLoading(handleSubmit)

  return (
    <Flex
      align="center"
      direction="column"
      gap="md"
      height="100%"
      justify="center"
      width="100%"
    >
      <Text asChild>
        <Icon icon="tabler:lock-access" size="7rem" />
      </Text>
      <Text align="center" size="4xl" weight="semibold">
        {t('vault.lockedMessage')}
      </Text>
      <Text align="center" color="muted" mb="3xl" size="lg">
        {t('vault.passwordRequired')}
      </Text>
      <Box width={{ base: '100%', md: '75%', xl: '50%' }}>
        <TextInput
          isPassword
          icon="tabler:lock"
          label="vault.inputs.masterPassword"
          namespace="common.vault"
          placeholder="••••••••••••••••"
          value={masterPassWordInputContent}
          onChange={setMasterPassWordInputContent}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSubmit().catch(console.error)
            }
          }}
        />
      </Box>
      <Box mt="lg" width={{ base: '100%', md: '75%', xl: '50%' }}>
        <Button
          icon="tabler:lock"
          loading={loading}
          namespace="common.vault"
          width="100%"
          onClick={() => {
            onSubmit().catch(console.error)
          }}
        >
          vault.buttons.unlock
        </Button>
      </Box>
    </Flex>
  )
}
