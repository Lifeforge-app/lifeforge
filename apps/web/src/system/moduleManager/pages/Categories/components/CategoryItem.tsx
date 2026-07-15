import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { useFederation } from '@lifeforge/federation'
import {
  Box,
  Button,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Text,
  WithDivide,
  toast,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import ModifyCategoryModal from './ModifyCategoryModal'

function CategoryItem({
  id,
  item: { key, value },
  onModify
}: {
  id: string
  item: { key: string; value: Record<string, string> }
  onModify: (
    newData: Array<{ key: string; value: Record<string, string> }>,
    oldKey?: string
  ) => void
}) {
  const { open } = useModalStore()
  const { categoryTranslations, refetch } = useFederation()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleDelete = async () => {
    try {
      const newCategoryTranslations = JSON.parse(
        JSON.stringify(categoryTranslations)
      )

      delete newCategoryTranslations[key]

      await forgeAPI.modules.categories.update.mutate({
        data: newCategoryTranslations
      })

      refetch.current()
    } catch (e) {
      toast.error('Failed to delete category')
      console.error(e)
    }
  }

  const onDelete = () => {
    open(ConfirmationModal, {
      title: 'Delete Category',
      description: 'Are you sure you want to delete this category?',
      onConfirm: handleDelete
    })
  }

  return (
    <Card
      ref={setNodeRef}
      align="center"
      direction="row"
      justify="between"
      style={style}
    >
      <Flex align="center" gap="md">
        <Button
          {...attributes}
          {...listeners}
          icon="tabler:menu"
          style={{
            cursor: 'move',
            touchAction: 'none'
          }}
          variant="plain"
        />
        <Box>
          <Text as="code" size="lg" weight="medium">
            {key}
          </Text>
          <Flex asChild align="center" mt="xs" wrap="wrap">
            <Text as="p" color="muted" size="sm">
              {Object.entries(value).map(([lang, text], index) => (
                <WithDivide key={lang} axis="x">
                  <Text
                    pl={
                      index === Object.entries(value).length - 1
                        ? 'sm'
                        : undefined
                    }
                    pr={index === 0 ? 'sm' : undefined}
                    px={
                      index && index !== Object.entries(value).length - 1
                        ? 'sm'
                        : undefined
                    }
                  >
                    <Text weight="medium">{lang}</Text>: {text}
                  </Text>
                </WithDivide>
              ))}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:pencil"
          label="edit"
          onClick={() =>
            open(ModifyCategoryModal, {
              openType: 'update',
              category: { key, value },
              onSubmit: newData => onModify(newData, key)
            })
          }
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="delete"
          onClick={onDelete}
        />
      </ContextMenu>
    </Card>
  )
}

export default CategoryItem
