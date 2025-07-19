import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import {
  ISchemaWithPB,
  IdeaBoxCollectionsSchemas
} from 'shared/types/collections'
import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

function ModifyFolderModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder> | null
  }
  onClose: () => void
}) {
  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const [formState, setFormState] = useState<
    IdeaBoxControllersSchemas.IFolders['createFolder' | 'updateFolder']['body']
  >({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Folder name',
      icon: 'tabler:folder',
      placeholder: 'My Folder',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Folder icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
      label: 'Folder color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (type === 'update' && existedData !== null) {
      setFormState({
        name: existedData.name,
        icon: existedData.icon,
        color: existedData.color
      })
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
      endpoint="idea-box/folders"
      fields={FIELDS}
      getFinalData={async data => {
        return {
          ...data,
          container: id,
          parent: path?.split('/').pop()
        }
      }}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type]
      }
      id={existedData?.id}
      namespace="apps.ideaBox"
      openType={type}
      queryKey={['idea-box', 'folders', id!, path!]}
      setData={setFormState}
      title={`folder.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyFolderModal
