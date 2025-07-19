import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import {
  ISchemaWithPB,
  IdeaBoxCollectionsSchemas
} from 'shared/types/collections'
import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

function ModifyTagModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: ISchemaWithPB<IdeaBoxCollectionsSchemas.ITag> | null
  }
  onClose: () => void
}) {
  const { id } = useParams<{ id: string }>()

  const [formState, setFormState] = useState<
    | IdeaBoxControllersSchemas.ITags['createTag']['body']
    | IdeaBoxControllersSchemas.ITags['updateTag']['body']
  >({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'name',
      label: 'Tag name',
      icon: 'tabler:tag',
      placeholder: 'My tag',
      type: 'text',
      disabled: true
    },
    {
      id: 'icon',
      label: 'Tag icon',
      type: 'icon'
    },
    {
      id: 'color',
      label: 'Tag color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (existedData !== null) {
      setFormState(existedData)
    } else {
      setFormState({
        name: '',
        icon: '',
        color: ''
      })
    }
  }, [type, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="idea-box/tags"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!]
      }
      id={existedData?.id}
      namespace="apps.ideaBox"
      openType={type}
      queryKey={['idea-box', 'tags', id!]}
      setData={setFormState}
      title={`tag.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyTagModal
