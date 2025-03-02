import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import FormModal from '@components/modals/FormModal'
import { IIdeaBoxTagFormState } from '@interfaces/ideabox_interfaces'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'

function ModifyTagModal(): React.ReactElement {
  const {
    modifyTagModalOpenType: openType,
    setModifyTagModalOpenType: setOpenType,
    existedTag: existedData
  } = useIdeaBoxContext()
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
  }, [openType, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="idea-box/tags"
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
      queryKey={['idea-box', 'tags', id!]}
      setData={setFormState}
      title={`tag.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyTagModal
