import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { ErrorScreen, FormModal, LoadingScreen } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { useProjectsMContext } from '../providers/ProjectsMProvider'

function ModifyEntryModal() {
  const {
    entries: {
      refreshData: refreshEntries,
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

  if (
    [categories, statuses, visibilities, technologies].some(
      data => data === 'error'
    )
  ) {
    return <ErrorScreen message="Failed to fetch data" />
  }

  if (
    [categories, statuses, visibilities, technologies].some(
      data => data === 'loading'
    )
  ) {
    return <LoadingScreen />
  }

  async function onSubmitButtonClick() {
    const { name, icon, color, category, status, visibility } = data
    if (
      name.trim().length === 0 ||
      !color ||
      icon.trim().length === 0 ||
      !category ||
      !status ||
      !visibility
    ) {
      toast.error('Please fill in all the required fields.')
      return
    }

    try {
      await fetchAPI(
        `projects-m/entries${
          openType === 'update' ? `/${existedData?.id}` : ''
        }`,
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: data
        }
      )

      refreshEntries()
      setExistedData(null)
      setOpenType(null)
    } catch {
      toast.error('Error')
    }
  }

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      isOpen={openType !== null}
      namespace="modules.projectsM"
      openType={openType}
      setData={setData}
      title={`project.${openType}`}
      onClose={() => {
        setOpenType(null)
        setExistedData(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyEntryModal
