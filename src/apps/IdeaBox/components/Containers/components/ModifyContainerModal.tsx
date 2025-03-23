import { useEffect, useState } from 'react'

import { FormModal, type IFieldProps } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

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
  const imageGenAPIKeyExistsQuery = useAPIQuery<boolean>(
    'ai/image-generation/key-exists',
    ['ai', 'image-generation', 'key-exists']
  )
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
      type: 'file',
      enableAIImageGeneration: imageGenAPIKeyExistsQuery.data ?? false,
      defaultImageGenerationPrompt: `I have an idea box named "${formState.name}", where I store all my ideas related to this title. Can you generate a thumbnail for the idea box? The image should focus on the title of this idea box instead of the fact that this is the idea box. It should clearly represent the project or whatever the idea box is used to contain the idea for. In other words, do not include any words related to "idea box" in the image unless the title of the box said so.`
    }
  ]

  useEffect(() => {
    if (openType === 'update' && existedData !== null) {
      setFormState({
        name: existedData.name,
        icon: existedData.icon,
        color: existedData.color,
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
      namespace="apps.ideaBox"
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
