import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useForgeMutation, usePromiseLoading } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Alert,
  Box,
  Button,
  EmptyStateScreen,
  ModalHeader,
  Stack,
  TextAreaInput,
  WithQuery,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function ManagePromptsModal({ onClose }: { onClose: () => void }) {
  const { t } = useModuleTranslation()

  const messagesQuery = useQuery(
    forgeAPI.transactions.prompts.get.queryOptions()
  )

  const openaiAPIKeyAvailabilityQuery = useQuery(
    forgeAPI.checkAPIKeys({ keys: 'openai' }).queryOptions()
  )

  const [prompts, setPrompts] = useState<{ income: string; expenses: string }>({
    income: '',
    expenses: ''
  })

  const savePromptsMutation = useForgeMutation(
    forgeAPI.transactions.prompts.update,
    {
      action: 'save',
      onSuccess: () => {
        toast.success(t('toasts.savePrompts.success'))
        messagesQuery.refetch()
        onClose()
      },
      onError: () => toast.error(t('toasts.savePrompts.error'))
    }
  )

  async function handleAutoGeneratePrompt(field: 'income' | 'expenses') {
    try {
      const response = await forgeAPI.transactions.prompts.autoGenerate.mutate({
        type: field,
        count: 50
      })

      setPrompts(prev => ({ ...prev, [field]: response }))
    } catch {
      toast.error(t('toasts.autoGeneratePrompt.error'))
    }
  }

  const [generateLoading, onAutoGenerate] = usePromiseLoading(
    handleAutoGeneratePrompt
  )

  const [saveLoading, onSave] = usePromiseLoading(async () => {
    await savePromptsMutation.mutateAsync(prompts)
  })

  useEffect(() => {
    if (messagesQuery.data) {
      setPrompts({
        income: messagesQuery.data.income,
        expenses: messagesQuery.data.expenses
      })
    }
  }, [messagesQuery.data])

  return (
    <Box minWidth="60vw">
      <ModalHeader
        icon="tabler:robot"
        title="Manage Prompts"
        onClose={onClose}
      />
      <Alert mb="lg" type="note">
        {t('messages.promptAutoGeneration')}
      </Alert>
      <WithQuery query={openaiAPIKeyAvailabilityQuery}>
        {keyAvailable =>
          keyAvailable ? (
            <WithQuery query={messagesQuery}>
              {() => (
                <Stack gap="xl">
                  <Stack gap="md">
                    <TextAreaInput
                      icon="tabler:arrow-up-circle"
                      label="Income Prompt"
                      placeholder="Prompt used to generate particulars for income transactions."
                      value={prompts.income}
                      onChange={value =>
                        setPrompts(prev => ({ ...prev, income: value }))
                      }
                    />
                    <Button
                      icon="mage:stars-c"
                      loading={generateLoading}
                      variant="secondary"
                      width="100%"
                      onClick={() => onAutoGenerate('income')}
                    >
                      Auto Generate
                    </Button>
                  </Stack>
                  <Stack gap="md">
                    <TextAreaInput
                      icon="tabler:arrow-down-circle"
                      label="Expenses Prompt"
                      placeholder="Prompt used to generate particulars for expenses transactions."
                      value={prompts.expenses}
                      onChange={value =>
                        setPrompts(prev => ({ ...prev, expenses: value }))
                      }
                    />
                    <Button
                      icon="mage:stars-c"
                      loading={generateLoading}
                      variant="secondary"
                      width="100%"
                      onClick={() => onAutoGenerate('expenses')}
                    >
                      Auto Generate
                    </Button>
                  </Stack>
                  <Button
                    icon="tabler:device-floppy"
                    loading={saveLoading}
                    mt="md"
                    width="100%"
                    onClick={onSave}
                  >
                    Save Prompts
                  </Button>
                </Stack>
              )}
            </WithQuery>
          ) : (
            <EmptyStateScreen
              icon="tabler:robot-off"
              message={{
                id: 'openAIApiKeyRequired'
              }}
            />
          )
        }
      </WithQuery>
    </Box>
  )
}

export default ManagePromptsModal
