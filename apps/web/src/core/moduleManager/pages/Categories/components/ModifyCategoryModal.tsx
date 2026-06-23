import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Bordered,
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

type CategoryEntry = {
  key: string
  value: [string, string][]
}

function ModifyCategoryModal({
  onClose,
  data: { openType, category, initialKeys, onSubmit }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    category?: {
      key: string
      value: Record<string, string>
    }
    initialKeys?: string[]
    onSubmit: (
      categories: Array<{ key: string; value: Record<string, string> }>
    ) => void
  }
}) {
  const { t } = useTranslation('common.module-manager')
  const languagesQuery = useQuery(forgeAPI.locales.listLanguages.queryOptions())
  const { open } = useModalStore()

  const [categories, setCategories] = useState<CategoryEntry[]>([
    {
      key: category?.key || '',
      value: Object.entries(category?.value || {})
    }
  ])

  const [aiLoading, setAiLoading] = useState(false)

  function updateCategory(
    index: number,
    updater: (cat: CategoryEntry) => CategoryEntry
  ) {
    setCategories(prev =>
      prev.map((cat, i) => (i === index ? updater(cat) : cat))
    )
  }

  function addCategory() {
    setCategories(prev => [
      ...prev,
      {
        key: '',
        value: languagesQuery.data?.map(({ name }) => [name, '']) || []
      }
    ])
  }

  function removeCategory(index: number) {
    setCategories(prev => prev.filter((_, i) => i !== index))
  }

  function handleSubmit() {
    for (const cat of categories) {
      if (!cat.key.trim() || cat.value.some(([_, v]) => !v.trim())) {
        toast.error('Please fill in all fields')

        return
      }
    }

    try {
      const newCategories = categories.map(cat => ({
        key: cat.key,
        value: Object.fromEntries(cat.value)
      }))

      onSubmit(newCategories)
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  async function handleAiTranslate(catIndex: number) {
    const cat = categories[catIndex]

    if (!cat.key.trim()) {
      toast.error('Please fill in the category key')

      return
    }

    setAiLoading(true)

    try {
      const languages = cat.value.map(([key]) => key)

      const result = await forgeAPI.modules.categories.aiTranslate.mutate({
        key: cat.key,
        languages
      })

      if (!result) {
        throw new Error('Something went wrong')
      }

      updateCategory(catIndex, c => ({
        ...c,
        value: Object.entries(result)
      }))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => {
    if (!languagesQuery.data) return

    if (openType === 'create') {
      if (initialKeys && initialKeys.length > 0) {
        setCategories(
          initialKeys.map(key => ({
            key,
            value: languagesQuery.data!.map(({ name }) => [name, ''])
          }))
        )
      } else if (!category) {
        setCategories([
          {
            key: '',
            value: languagesQuery.data.map(({ name }) => [name, ''])
          }
        ])
      }
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
                <Stack gap="xl">
                  {categories.map((cat, catIndex) => (
                    <Box key={catIndex}>
                      {catIndex > 0 && (
                        <Bordered
                          borderColor={{
                            base: 'bg-200',
                            dark: 'bg-800'
                          }}
                          borderSide="bottom"
                          mb="xl"
                        />
                      )}
                      {categories.length > 1 && (
                        <Flex align="center" gap="sm" justify="between" mb="sm">
                          <Text size="lg" weight="semibold">
                            Category {catIndex + 1}
                          </Text>
                          <Button
                            dangerous
                            icon="tabler:trash"
                            p="sm"
                            variant="plain"
                            onClick={() => removeCategory(catIndex)}
                          />
                        </Flex>
                      )}
                      <TextInput
                        required
                        actionButtonProps={
                          keyAvailable
                            ? {
                                icon: 'mage:stars-c',
                                onClick: () => handleAiTranslate(catIndex),
                                loading: aiLoading
                              }
                            : undefined
                        }
                        icon="tabler:category"
                        label="Category Key"
                        namespace="common.module-manager"
                        placeholder="e.g. productivity, finance, information, etc."
                        value={cat.key}
                        onChange={key =>
                          updateCategory(catIndex, c => ({ ...c, key }))
                        }
                      />
                      <Text asChild color="muted" weight="medium">
                        <Flex align="center" gap="sm" mt="xl">
                          <Icon icon="mingcute:translate-line" />
                          {t('misc.translations')}
                        </Flex>
                      </Text>
                      <Stack mt="md">
                        {cat.value.map(([key, value], langIndex) => (
                          <Flex key={key} align="center" gap="md">
                            <TextInput
                              required
                              actionButtonProps={{
                                icon: 'tabler:pencil',
                                onClick: () => {
                                  open(ModifyTranslationKeyModal, {
                                    openType: 'update',
                                    key,
                                    onSubmit: newKey => {
                                      updateCategory(catIndex, c => ({
                                        ...c,
                                        value: c.value.map(([k, v], i) =>
                                          i === langIndex ? [newKey, v] : [k, v]
                                        )
                                      }))
                                    }
                                  })
                                }
                              }}
                              icon="tabler:language"
                              label={key}
                              namespace={false}
                              placeholder="e.g. Productivity, Produktiviti, 生产力, 生產力, etc."
                              value={value}
                              onChange={val =>
                                updateCategory(catIndex, c => ({
                                  ...c,
                                  value: c.value.map(([k, v], i) =>
                                    i === langIndex ? [k, val] : [k, v]
                                  )
                                }))
                              }
                            />
                            <Button
                              dangerous
                              icon="tabler:trash"
                              variant="plain"
                              onClick={() => {
                                updateCategory(catIndex, c => ({
                                  ...c,
                                  value: c.value.filter(
                                    (_, i) => i !== langIndex
                                  )
                                }))
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
                              if (cat.value.some(([k]) => k === key))
                                throw new Error(
                                  'Translation key already exists'
                                )

                              updateCategory(catIndex, c => ({
                                ...c,
                                value: [...c.value, [key, '']]
                              }))
                            }
                          })
                        }}
                      >
                        Add Translation
                      </Button>
                    </Box>
                  ))}
                </Stack>
                {openType === 'create' && (
                  <Button
                    icon="tabler:plus"
                    mt="lg"
                    namespace="common.module-manager"
                    variant="plain"
                    width="100%"
                    onClick={addCategory}
                  >
                    Add Category
                  </Button>
                )}
                <Button
                  icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
                  mt="sm"
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
