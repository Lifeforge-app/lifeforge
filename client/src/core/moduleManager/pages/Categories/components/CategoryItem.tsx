import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Button,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from 'lifeforge-ui'
import { toast } from 'react-toastify'

import { useFederation } from '@/federation'
import forgeAPI from '@/forgeAPI'

import ModifyCategoryModal from './ModifyCategoryModal'

function CategoryItem({
  id,
  item: { key, value },
  onModify
}: {
  id: string
  item: { key: string; value: Record<string, string> }
  onModify: (
    newData: { key: string; value: Record<string, string> },
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

      refetch()
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
    <Card ref={setNodeRef} className="flex-between" style={style}>
      <div className="flex items-center gap-4">
        <Button
          {...attributes}
          {...listeners}
          className="cursor-move! touch-none"
          icon="tabler:menu"
          variant="plain"
        />
        <div>
          <h3 className="text-lg font-medium">{key}</h3>
          <p className="text-bg-500 divide-bg-700 mt-1 flex flex-wrap items-center divide-x text-sm">
            {Object.entries(value).map(([lang, text], index) => (
              <span
                key={lang}
                className={
                  index === 0
                    ? 'pr-2'
                    : index === Object.entries(value).length - 1
                      ? 'pl-2'
                      : 'px-2'
                }
              >
                <span className="font-medium">{lang}</span>: {text}
              </span>
            ))}
          </p>
        </div>
      </div>
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
