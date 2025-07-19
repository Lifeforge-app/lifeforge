import { FormModal, type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import { useAPIQuery } from 'shared/lib'
import {
  ISchemaWithPB,
  IdeaBoxCollectionsSchemas
} from 'shared/types/collections'
import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

function ModifyContainerModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainer> | null
  }
  onClose: () => void
}) {
  const imageGenAPIKeyExistsQuery = useAPIQuery<boolean>(
    'ai/image-generation/key-exists',
    ['ai', 'image-generation', 'key-exists']
  )

  const [formState, setFormState] = useState<
    Omit<
      IdeaBoxControllersSchemas.IContainers[
        | 'createContainer'
        | 'updateContainer']['body'],
      'cover'
    > & {
      cover: {
        image: string | File | null
        preview: string | null
      }
    }
  >({
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
    if (type === 'update' && existedData !== null) {
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
  }, [type, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="idea-box/containers"
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
      queryKey={['idea-box', 'containers']}
      setData={setFormState}
      title={`container.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyContainerModal
