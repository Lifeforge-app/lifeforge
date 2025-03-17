import { useEffect, useState } from 'react'

import { FormModal, type IFieldProps } from '@lifeforge/ui'

import {
  type IIdeaBoxContainer,
  IIdeaBoxContainerFormState
} from '../../../interfaces/ideabox_interfaces'

function ModifyContainerModal({
  openType,
  setOpenType,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IIdeaBoxContainer | null
}) {
  const [formState, setFormState] = useState<IIdeaBoxContainerFormState>({
    name: '',
    icon: '',
    color: '',
    cover: {
      image: null,
      preview: null
    }
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Container name',
      icon: 'tabler:cube',
      placeholder: 'My container',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Container icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
      label: 'Container color',
      type: 'color'
    },
    {
      id: 'cover',
      label: 'Cover Image',
      type: 'file'
    }
  ]

  useEffect(() => {
    if (openType === 'update' && existedData !== null) {
      setFormState({
        ...existedData,
        cover:
          existedData.cover !== ''
            ? {
                image: 'keep',
                preview: `${import.meta.env.VITE_API_HOST}/media/${
                  existedData.cover
                }`
              }
            : {
                image: null,
                preview: null
              }
      })
    } else {
      setFormState({
        name: '',
        icon: '',
        color: '',
        cover: {
          image: null,
          preview: null
        }
      })
    }
  }, [openType, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="idea-box/containers"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      id={existedData?.id}
      isOpen={openType !== null}
      namespace="modules.ideaBox"
      openType={openType}
      queryKey={['idea-box', 'containers']}
      setData={setFormState}
      title={`container.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyContainerModal
