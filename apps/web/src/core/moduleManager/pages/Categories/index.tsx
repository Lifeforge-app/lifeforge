import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SYSTEM_CATEGORIES, useFederation } from '@lifeforge/federation'
import {
  Alert,
  Button,
  EmptyStateScreen,
  ModuleHeader,
  Stack,
  Text,
  toast,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import CategoryItem from './components/CategoryItem'
import ModifyCategoryModal from './components/ModifyCategoryModal'

function Categories() {
  const { t } = useTranslation('common.module-manager')
  const { open } = useModalStore()
  const { categoryTranslations, modules, refetch } = useFederation()

  const [items, setItems] = useState<
    Array<{ key: string; value: Record<string, string> }>
  >([])
  const missingKeys = useMemo(() => {
    const allKeys = [
      ...new Set([
        ...Object.keys(categoryTranslations),
        ...modules
          .flatMap(module =>
            module.items.map(item => item.category.toLowerCase())
          )
          .filter(
            key =>
              !SYSTEM_CATEGORIES.map(cat => cat.toLowerCase()).includes(key)
          )
      ])
    ]

    return allKeys.filter(key => !categoryTranslations[key])
  }, [categoryTranslations, modules])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  useEffect(() => {
    setItems(
      Object.entries(categoryTranslations).map(([key, value]) => ({
        key,
        value
      }))
    )
  }, [categoryTranslations])

  const handleModify = async (
    categories: Array<{ key: string; value: Record<string, string> }>,
    oldKey?: string
  ) => {
    try {
      const newCategoryTranslations = JSON.parse(
        JSON.stringify(categoryTranslations)
      )

      if (oldKey) delete newCategoryTranslations[oldKey]

      for (const { key, value } of categories) {
        newCategoryTranslations[key] = value
      }

      await forgeAPI.modules.categories.update.mutate({
        data: newCategoryTranslations
      })

      setTimeout(() => {
        refetch.current()
      }, 300)
    } catch (e) {
      toast.error('Failed to update category')
      console.error(e)
    }
  }

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex(item => item.key === active.id)

        const newIndex = items.findIndex(item => item.key === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        setItems(newItems)

        try {
          const newCategoryTranslations: Record<
            string,
            Record<string, string>
          > = {}

          for (const item of newItems) {
            newCategoryTranslations[item.key] = item.value
          }

          await forgeAPI.modules.categories.update.mutate({
            data: newCategoryTranslations
          })

          refetch.current()
        } catch (e) {
          toast.error('Failed to reorder categories')
          console.error(e)
        }
      }
    },
    [items, refetch]
  )

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            display={{ base: 'none', md: 'flex' }}
            icon="tabler:plus"
            tProps={{
              item: t('items.category')
            }}
            onClick={() => {
              open(ModifyCategoryModal, {
                openType: 'create',
                onSubmit: handleModify
              })
            }}
          >
            new
          </Button>
        }
        icon="tabler:category"
        namespace="common.module-manager"
        title="categories"
        totalItems={items.length}
      />
      {missingKeys.length > 0 && (
        <Alert mb="md" type="warning">
          {t('messages.categoriesMissingTranslations', {
            count: missingKeys.length
          })}{' '}
          {missingKeys.map((key, idx) => (
            <>
              <Text key={key} as="code">
                {key}
              </Text>
              {idx < missingKeys.length - 1 && ', '}
            </>
          ))}
          <Button
            icon="tabler:plus"
            mt="md"
            variant="secondary"
            width="100%"
            onClick={() => {
              open(ModifyCategoryModal, {
                openType: 'create',
                initialKeys: missingKeys,
                onSubmit: handleModify
              })
            }}
          >
            Create All
          </Button>
        </Alert>
      )}
      {items.length > 0 ? (
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(item => item.key)}
            strategy={verticalListSortingStrategy}
          >
            <Stack>
              {items.map(item => (
                <CategoryItem
                  key={item.key}
                  id={item.key}
                  item={item}
                  onModify={handleModify}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      ) : (
        <EmptyStateScreen
          icon="tabler:apps-off"
          message={{
            id: 'category',
            namespace: 'common.module-manager'
          }}
        />
      )}
    </>
  )
}

export default Categories
