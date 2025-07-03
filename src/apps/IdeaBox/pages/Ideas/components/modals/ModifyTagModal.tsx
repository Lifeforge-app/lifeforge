import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import {
  IIdeaBoxTag,
  IIdeaBoxTagFormState
} from '@apps/IdeaBox/interfaces/ideabox_interfaces'

function ModifyTagModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: IIdeaBoxTag | null
  }
  onClose: () => void
}) {
  const { id } = useParams<{ id: string }>()
  const [formState, setFormState] = useState<IIdeaBoxTagFormState>({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<IIdeaBoxTagFormState>[] = [
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
