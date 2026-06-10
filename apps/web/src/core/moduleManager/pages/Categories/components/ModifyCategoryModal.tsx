import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Button,
  Flex,
  Icon,
  ModalHeader,
  Stack,
  Text,
  TextInput,
  WithQuery,
  WithQueryData,
  toast,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import ModifyTranslationKeyModal from './ModifyTranslationKeyModal'

function ModifyCategoryModal({
  onClose,
  data: { openType, category, onSubmit }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    category?: {
      key: string
      value: Record<string, string>
    }
    onSubmit: (category: { key: string; value: Record<string, string> }) => void
  }
}) {
  const { t } = useTranslation('common.module-manager')
  const languagesQuery = useQuery(forgeAPI.locales.listLanguages.queryOptions())
  const { open } = useModalStore()

  const [data, setData] = useState({
    key: category?.key || '',
    value: Object.entries(category?.value || {})
  })

  const [aiLoading, setAiLoading] = useState(false)

  function handleSubmit() {
    if (!data.key.trim() || data.value.some(([_, v]) => !v.trim())) {
      toast.error('Please fill in all fields')

      return
    }

    try {
      const newCategory = {
        key: data.key,
        value: Object.fromEntries(data.value)
      }

      onSubmit(newCategory)
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  async function handleAiTranslate() {
    if (!data.key.trim()) {
      toast.error('Please fill in the category key')

      return
    }

    setAiLoading(true)

    try {
      const languages = data.value.map(([key]) => key)

      const result = await forgeAPI.modules.categories.aiTranslate.mutate({
        key: data.key,
        languages
      })

      if (!result) {
        throw new Error('Something went wrong')
      }

      setData({
        ...data,
        value: Object.entries(result)
      })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => {
    if (!languagesQuery.data) return

    if (openType === 'create') {
      setData({
        key: '',
        value: languagesQuery.data.map(({ name }) => [name, ''])
      })
    }
  }, [languagesQuery.data])

  return (
    <Box minWidth="40vw">
      <ModalHeader
        icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        namespace="common.module-manager"
        title={`category.${openType}`}
        onClose={onClose}
      />
      <WithQueryData
        controller={forgeAPI.checkAPIKeys({
          keys: 'openai'
        })}
      >
        {keyAvailable => (
          <WithQuery query={languagesQuery}>
            {() => (
              <>
                <TextInput
                  required
                  actionButtonProps={
                    keyAvailable
                      ? {
                          icon: 'mage:stars-c',
                          onClick: handleAiTranslate,
                          loading: aiLoading
                        }
                      : undefined
                  }
                  icon="tabler:category"
                  label="Category Key"
                  namespace="common.module-manager"
                  placeholder="e.g. productivity, finance, information, etc."
                  value={data.key}
                  onChange={value => setData({ ...data, key: value })}
                />
                <Text asChild color="muted" weight="medium">
                  <Flex align="center" gap="sm" mt="xl">
                    <Icon icon="mingcute:translate-line" />
                    {t('misc.translations')}
                  </Flex>
                </Text>
                <Stack mt="md">
                  {data.value.map(([key, value], index) => (
                    <Flex key={index} align="center" gap="md">
                      <TextInput
                        required
                        actionButtonProps={{
                          icon: 'tabler:pencil',
                          onClick: () => {
                            open(ModifyTranslationKeyModal, {
                              openType: 'update',
                              key,
                              onSubmit: key => {
                                setData({
                                  ...data,
                                  value: data.value.map(([k, v], i) =>
                                    i === index ? [key, v] : [k, v]
                                  )
                                })
                              }
                            })
                          }
                        }}
                        icon="tabler:language"
                        label={key}
                        placeholder="e.g. Productivity, Produktiviti, 生产力, 生產力, etc."
                        value={value}
                        onChange={value => {
                          setData({
                            ...data,
                            value: data.value.map(([k, v], i) =>
                              i === index ? [k, value] : [k, v]
                            )
                          })
                        }}
                      />
                      <Button
                        dangerous
                        icon="tabler:trash"
                        variant="plain"
                        onClick={() => {
                          setData({
                            ...data,
                            value: data.value.filter((_, i) => i !== index)
                          })
                        }}
                      />
                    </Flex>
                  ))}
                </Stack>
                <Button
                  icon="tabler:plus"
                  mt="lg"
                  namespace="common.module-manager"
                  variant="plain"
                  width="100%"
                  onClick={() => {
                    open(ModifyTranslationKeyModal, {
                      openType: 'create',
                      onSubmit: key => {
                        if (data.value.some(([k]) => k === key))
                          throw new Error('Translation key already exists')

                        setData({
                          ...data,
                          value: [...data.value, [key, '']]
                        })
                      }
                    })
                  }}
                >
                  Add Translation
                </Button>
                <Button
                  icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
                  mt="xl"
                  width="100%"
                  onClick={handleSubmit}
                >
                  {openType}
                </Button>
              </>
            )}
          </WithQuery>
        )}
      </WithQueryData>
    </Box>
  )
}

export default ModifyCategoryModal
