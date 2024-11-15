/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import Modal from '@components/Modals/Modal'
import ErrorScreen from '@components/Screens/ErrorScreen'
import LoadingScreen from '@components/Screens/LoadingScreen'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import {
  type IProjectsMCategory,
  type IProjectsMStatus,
  type IProjectsMTechnology,
  type IProjectsMVisibility
} from '@interfaces/projects_m_interfaces'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import APIRequest from '@utils/fetchData'

function ModifyEntryModal(): React.ReactElement {
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

  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      icon: '',
      color: '',
      category: '',
      status: '',
      visibility: '',
      technologies: [] as string[]
    }
  )

  const FIELDS: IFieldProps[] = [
    {
      id: 'name',
      type: 'text',
      label: 'Project name',
      icon: 'tabler:book',
      placeholder: 'My Project'
    },
    {
      id: 'icon',
      type: 'icon',
      label: 'Project icon'
    },
    {
      id: 'color',
      type: 'color',
      label: 'Project color'
    },
    {
      id: 'category',
      type: 'listbox',
      label: 'Project category',
      icon: 'tabler:category',
      options: (categories as IProjectsMCategory[]).map(category => ({
        value: category.id,
        icon: category.icon,
        text: category.name
      })),
      nullOption: 'tabler:apps-off'
    },
    {
      id: 'status',
      type: 'listbox',
      label: 'Project status',
      icon: 'tabler:info-circle',
      options: (statuses as IProjectsMStatus[]).map(status => ({
        value: status.id,
        icon: status.icon,
        text: status.name,
        color: status.color
      })),
      nullOption: 'tabler:progress-help'
    },
    {
      id: 'visibility',
      type: 'listbox',
      label: 'Project visibility',
      icon: 'tabler:eye',
      options: (visibilities as IProjectsMVisibility[]).map(visibility => ({
        value: visibility.id,
        icon: visibility.icon,
        text: visibility.name
      })),
      nullOption: 'tabler:eye-off'
    },
    {
      id: 'technologies',
      type: 'listbox',
      label: 'Project technologies',
      icon: 'tabler:cpu',
      options: (technologies as IProjectsMTechnology[]).map(technology => ({
        value: technology.id,
        text: technology.name,
        icon: technology.icon
      })),
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

  async function onSubmitButtonClick(): Promise<void> {
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

    await APIRequest({
      endpoint: `projects-m/entries${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: data,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshEntries()
        setExistedData(null)
        setOpenType(null)
      }
    })
  }

  return (
    <Modal
      isOpen={openType !== null}
      title={openType === 'update' ? 'Edit Project' : 'Add Project'}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      openType={openType}
      onClose={() => {
        setOpenType(null)
        setExistedData(null)
      }}
      fields={FIELDS}
      data={data}
      setData={setData}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyEntryModal
