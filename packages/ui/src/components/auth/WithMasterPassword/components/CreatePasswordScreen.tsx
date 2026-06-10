import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { encrypt } from '@lifeforge/api'
import type { ForgeEndpoint } from '@lifeforge/api'

import { Button, TextInput } from '@/components/inputs'
import { ConfirmationModal } from '@/components/overlays'
import { Box, Flex, Icon, Text } from '@/components/primitives'
import { toast, useModalStore } from '@/providers'

export function CreatePasswordScreen({
  controller,
  challengeController
}: {
  controller: ForgeEndpoint
  challengeController: ForgeEndpoint
}) {
  const { open } = useModalStore()
  const { t } = useTranslation('common.vault')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const createPasswordMutation = useMutation(
    controller.mutationOptions({
      onSuccess: () => {
        window.location.reload()
      },
      onError: () => {
        toast.error('Failed to create password')
      }
    })
  )

  function confirmAction(): void {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error(t('input.error.fieldEmpty'))

      return
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match')

      return
    }

    open(ConfirmationModal, {
      title: t('vault.confirmSetNewPassword.title'),
      description: t('vault.confirmSetNewPassword.desc'),
      onConfirm: async () => {
        const challenge = (await challengeController.query()) as string

        await createPasswordMutation.mutateAsync({
          password: encrypt(newPassword, challenge)
        } as never)
      }
    })
  }

  function generateRandomPassword(): void {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'

    const special = '!@#$%^&*()_+'

    const numbers = '0123456789'

    const all = upperCase + lowerCase + numbers + special

    let password = ''

    for (let i = 0; i < 12; i++) {
      password += all[Math.floor(Math.random() * all.length)]
    }
    setNewPassword(password)
    setConfirmPassword(password)

    toast.success('Random password generated successfully')
  }

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
        <Icon icon="tabler:lock-plus" size="7rem" />
      </Text>
      <Text size="4xl" weight="semibold">
        {t('vault.createPassword.title')}
      </Text>
      <Text align="center" color="muted" mb="3xl" size="lg">
        {t('vault.createPassword.desc')}
      </Text>
      <Box width={{ base: '100%', md: '50%' }}>
        <TextInput
          key="newPassword"
          isPassword
          actionButtonProps={{
            icon: 'tabler:dice',
            onClick: generateRandomPassword
          }}
          icon="tabler:lock"
          label="vault.inputs.newPassword"
          namespace="common.vault"
          placeholder="••••••••••••••••"
          value={newPassword}
          onChange={setNewPassword}
        />
      </Box>
      <Box width={{ base: '100%', md: '50%' }}>
        <TextInput
          key="confirmPassword"
          isPassword
          icon="tabler:lock-check"
          label="vault.inputs.confirmPassword"
          namespace="common.vault"
          placeholder="••••••••••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              confirmAction()
            }
          }}
        />
      </Box>
      <Box mt="lg" width={{ base: '100%', md: '50%' }}>
        <Button icon="tabler:check" width="100%" onClick={confirmAction}>
          Submit
        </Button>
      </Box>
    </Flex>
  )
}
