import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  ModalHeader,
  TextInput,
  WithQuery,
  WithQueryData,
  useModalStore
} from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

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
    <div className="min-w-[40vw]">
      <ModalHeader
        icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        namespace="common.moduleManager"
        title={`category.${openType}`}
        onClose={onClose}
      />
      <WithQueryData
        controller={forgeAPI.apiKeys.entries.checkKeys.input({
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
                  placeholder="e.g. productivity, finance, information, etc."
                  value={data.key}
                  onChange={value => setData({ ...data, key: value })}
                />
                <div className="text-bg-500 mt-6 flex items-center gap-2">
                  <Icon className="size-5" icon="mingcute:translate-line" />
                  <span className="font-medium">Translations</span>
                </div>
                <div className="mt-3 space-y-3">
                  {data.value.map(([key, value], index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-3">
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
                      </div>
                    </div>
                  ))}
                  <Button
                    className="w-full"
                    icon="tabler:plus"
                    variant="plain"
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
                </div>
                <Button
                  className="mt-6 w-full"
                  icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
                  onClick={handleSubmit}
                >
                  {openType}
                </Button>
              </>
            )}
          </WithQuery>
        )}
      </WithQueryData>
    </div>
  )
}

export default ModifyCategoryModal
