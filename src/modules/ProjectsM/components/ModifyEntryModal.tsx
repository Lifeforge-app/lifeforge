import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { useProjectsMContext } from '../providers/ProjectsMProvider'

function ModifyEntryModal() {
  const {
    entries: {
      modifyDataModalOpenType: openType,
      setModifyDataModalOpenType: setOpenType,
      setExistedData,
      existedData
    },
    categories: { data: categories },
    statuses: { data: statuses },
    visibilities: { data: visibilities },
    technologies: { data: technologies }
  } = useProjectsMContext()

  const [data, setData] = useState({
    name: '',
    icon: '',
    color: '',
    category: '',
    status: '',
    visibility: '',
    technologies: [] as string[]
  })

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      required: true,
      type: 'text',
      label: 'Project name',
      icon: 'tabler:book',
      placeholder: 'My Project'
    },
    {
      id: 'icon',
      required: true,
      type: 'icon',
      label: 'Project icon'
    },
    {
      id: 'color',
      required: true,
      type: 'color',
      label: 'Project color'
    },
    {
      id: 'category',
      required: true,
      type: 'listbox',
      label: 'Project category',
      icon: 'tabler:category',
      options:
        typeof categories !== 'string'
          ? categories.map(category => ({
              value: category.id,
              icon: category.icon,
              text: category.name
            }))
          : [],
      nullOption: 'tabler:apps-off'
    },
    {
      id: 'status',
      required: true,
      type: 'listbox',
      label: 'Project status',
      icon: 'tabler:info-circle',
      options:
        typeof statuses !== 'string'
          ? statuses.map(status => ({
              value: status.id,
              icon: status.icon,
              text: status.name,
              color: status.color
            }))
          : [],
      nullOption: 'tabler:progress-help'
    },
    {
      id: 'visibility',
      required: true,
      type: 'listbox',
      label: 'Project visibility',
      icon: 'tabler:eye',
      options:
        typeof visibilities !== 'string'
          ? visibilities.map(visibility => ({
              value: visibility.id,
              icon: visibility.icon,
              text: visibility.name
            }))
          : [],
      nullOption: 'tabler:eye-off'
    },
    {
      id: 'technologies',
      type: 'listbox',
      label: 'Project technologies',
      icon: 'tabler:cpu',
      options:
        typeof technologies !== 'string'
          ? technologies.map(technology => ({
              value: technology.id,
              text: technology.name,
              icon: technology.icon
            }))
          : [],
      multiple: true,
      nullOption: 'tabler:flask-off'
    }
  ]

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setData(existedData)
        }
      } else {
        setData({
          name: '',
          icon: '',
          color: '',
          category: '',
          status: '',
          visibility: '',
          technologies: []
        })
      }
    }
  }, [openType, existedData])

  return (
    <FormModal
      data={data}
      endpoint="projects-m/entries"
      fields={FIELDS}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      id={existedData?.id}
      isOpen={openType !== null}
      namespace="modules.projectsM"
      openType={openType}
      queryKey={['projects-m', 'entries']}
      setData={setData}
      title={`project.${openType}`}
      onClose={() => {
        setOpenType(null)
        setExistedData(null)
      }}
    />
  )
}

export default ModifyEntryModal
