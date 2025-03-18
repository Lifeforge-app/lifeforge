import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import { IIdeaBoxFolderFormState } from '../../../../interfaces/ideabox_interfaces'

function ModifyFolderModal() {
  const {
    modifyFolderModalOpenType: openType,
    setModifyFolderModalOpenType: setOpenType,
    existedFolder: existedData
  } = useIdeaBoxContext()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()
  const [formState, setFormState] = useState<IIdeaBoxFolderFormState>({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<IIdeaBoxFolderFormState>[] = [
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
    if (openType === 'update' && existedData !== null) {
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
  }, [openType, existedData])

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
        }[openType!]
      }
      id={existedData?.id}
      isOpen={openType !== null}
      namespace="apps.ideaBox"
      openType={openType}
      queryKey={['idea-box', 'folders', id!, path!]}
      setData={setFormState}
      title={`folder.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyFolderModal
