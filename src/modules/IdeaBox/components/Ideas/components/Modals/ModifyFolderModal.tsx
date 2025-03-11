import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { FormModal } from '@lifeforge/ui'

import { IIdeaBoxFolderFormState } from '@interfaces/ideabox_interfaces'
import { IFieldProps } from '@interfaces/modal_interfaces'

function ModifyFolderModal(): React.ReactElement {
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
      label: 'Folder name',
      icon: 'tabler:folder',
      placeholder: 'My Folder',
      type: 'text'
    },
    {
      id: 'icon',
      label: 'Folder icon',
      type: 'icon'
    },
    {
      id: 'color',
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
      namespace="modules.ideaBox"
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
