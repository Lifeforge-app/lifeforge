/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconSelector from '@components/ButtonsAndInputs/IconSelector'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import {
  type IProjectsMCategory,
  type IProjectsMTechnology,
  type IProjectsMVisibility,
  type IProjectsMEntry,
  type IProjectsMStatus
} from '@interfaces/projects_m_interfaces'
import APIRequest from '@utils/fetchData'
import CategorySelector from './components/CategorySelector'
import StatusSelector from './components/StatusSelector'
import TechnologySelector from './components/TechnologySelector'
import VisibilitySelector from './components/VisibilitySelector'

function ModifyEntryModal({
  openType,
  setOpenType,
  existedData,
  setExistedData,
  refreshEntries,
  categories,
  statuses,
  visibilities,
  technologies
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IProjectsMEntry | null
  setExistedData: React.Dispatch<React.SetStateAction<IProjectsMEntry | null>>
  refreshEntries: () => void
  categories: IProjectsMCategory[] | 'loading' | 'error'
  statuses: IProjectsMStatus[] | 'loading' | 'error'
  visibilities: IProjectsMVisibility[] | 'loading' | 'error'
  technologies: IProjectsMTechnology[] | 'loading' | 'error'
}): React.ReactElement {
  const [entryName, setEntryName] = useState('')
  const [entryIcon, setEntryIcon] = useState('')
  const [entryColor, setEntryColor] = useState<string>('#FFFFFF')
  const [entryCategory, setEntryCategory] = useState<string | null>(null)
  const [entryStatus, setEntryStatus] = useState<string | null>(null)
  const [entryVisibility, setEntryVisibility] = useState<string | null>(null)
  const [entryTechnologies, setEntryTechnologies] = useState<string[]>([])
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setEntryName(existedData.name)
          setEntryIcon(existedData.icon)
          setEntryColor(existedData.color)
          setEntryCategory(existedData.category)
          setEntryStatus(existedData.status)
          setEntryVisibility(existedData.visibility)
          setEntryTechnologies(existedData.technologies)
        }
      } else {
        setEntryName('')
        setEntryIcon('')
        setEntryColor('#FFFFFF')
        setEntryCategory('')
        setEntryStatus('')
        setEntryVisibility('')
        setEntryTechnologies([])
      }
    }
  }, [openType, existedData])

  function updateEntryName(e: React.ChangeEvent<HTMLInputElement>): void {
    setEntryName(e.target.value)
  }

  function updateEntryColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setEntryColor(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      entryName.trim().length === 0 ||
      !entryColor ||
      entryIcon.trim().length === 0 ||
      !entryCategory ||
      !entryStatus ||
      !entryVisibility
    ) {
      toast.error('Please fill in all the required fields.')
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `projects-m/entry${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: entryName,
        icon: entryIcon,
        color: entryColor,
        category: entryCategory,
        status: entryStatus,
        visibility: entryVisibility,
        technologies: entryTechnologies
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshEntries()
        setExistedData(null)
        setOpenType(null)
      },
      finalCallback: () => {
        setIsLoading(false)
      }
    })
  }

  return (
    <>
      <Modal isOpen={openType !== null} className="sm:min-w-[30rem]">
        <ModalHeader
          icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
          title={openType === 'update' ? 'Edit Project' : 'Add Project'}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:book"
          placeholder="My Project"
          value={entryName}
          darker
          name="Project name"
          updateValue={updateEntryName}
        />
        <IconInput
          icon={entryIcon}
          setIcon={setEntryIcon}
          name="Project icon"
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <ColorInput
          color={entryColor}
          name="Project color"
          setColorPickerOpen={setColorPickerOpen}
          updateColor={updateEntryColor}
        />
        <CategorySelector
          categories={categories}
          category={entryCategory}
          setCategory={setEntryCategory}
        />
        <StatusSelector
          statuses={statuses}
          status={entryStatus}
          setStatus={setEntryStatus}
        />
        <VisibilitySelector
          visibilities={visibilities}
          visibility={entryVisibility}
          setVisibility={setEntryVisibility}
        />
        <TechnologySelector
          selectedTechnologies={entryTechnologies}
          setSelectedTechnologies={setEntryTechnologies}
          technologies={technologies}
        />
        <CreateOrModifyButton
          loading={isLoading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={openType}
        />
      </Modal>
      <IconSelector
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setEntryIcon}
      />
      <ColorPickerModal
        color={entryColor}
        isOpen={colorPickerOpen}
        setColor={setEntryColor}
        setOpen={setColorPickerOpen}
      />
    </>
  )
}

export default ModifyEntryModal
