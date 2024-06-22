/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconSelector from '@components/ButtonsAndInputs/IconSelector'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IProjectsMTechnology } from '@interfaces/projects_m_interfaces'
import APIRequest from '@utils/fetchData'

function ModifyTechnologyModal({
  openType,
  setOpenType,
  existedData,
  setExistedData,
  refreshTechnologies
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IProjectsMTechnology | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IProjectsMTechnology | null>
  >
  refreshTechnologies: () => void
}): React.ReactElement {
  const [technologyName, setTechnologyName] = useState('')
  const [technologyIcon, setTechnologyIcon] = useState('')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setTechnologyName(existedData.name)
          setTechnologyIcon(existedData.icon)
        }
      } else {
        setTechnologyName('')
        setTechnologyIcon('')
      }
    }
  }, [openType, existedData])

  function updateTechnologyName(e: React.ChangeEvent<HTMLInputElement>): void {
    setTechnologyName(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      technologyName.trim().length === 0 ||
      technologyIcon.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `projects-m/technology${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: technologyName,
        icon: technologyIcon
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshTechnologies()
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
      {' '}
      <Modal isOpen={openType !== null} className="sm:min-w-[30rem]">
        <ModalHeader
          icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
          title={openType === 'update' ? 'Edit Technology' : 'Add Technology'}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:book"
          placeholder="My Technologies"
          value={technologyName}
          darker
          name="Technology name"
          updateValue={updateTechnologyName}
        />
        <IconInput
          icon={technologyIcon}
          setIcon={setTechnologyIcon}
          name="Technology icon"
          setIconSelectorOpen={setIconSelectorOpen}
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
        setSelectedIcon={setTechnologyIcon}
      />
    </>
  )
}

export default ModifyTechnologyModal
