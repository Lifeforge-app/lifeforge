/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconSelector from '@components/ButtonsAndInputs/IconSelector'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IProjectsMVisibility } from '@interfaces/projects_m_interfaces'
import APIRequest from '@utils/fetchData'

function ModifyVisibilityModal({
  openType,
  setOpenType,
  existedData,
  setExistedData,
  refreshVisibilities
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IProjectsMVisibility | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IProjectsMVisibility | null>
  >
  refreshVisibilities: () => void
}): React.ReactElement {
  const [visibilityName, setVisibilityName] = useState('')
  const [visibilityIcon, setVisibilityIcon] = useState('')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setVisibilityName(existedData.name)
          setVisibilityIcon(existedData.icon)
        }
      } else {
        setVisibilityName('')
        setVisibilityIcon('')
      }
    }
  }, [openType, existedData])

  function updateVisibilityName(e: React.ChangeEvent<HTMLInputElement>): void {
    setVisibilityName(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      visibilityName.trim().length === 0 ||
      visibilityIcon.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `projects-m/visibility${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: visibilityName,
        icon: visibilityIcon
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshVisibilities()
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
          title={openType === 'update' ? 'Edit Visibility' : 'Add Visibility'}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:book"
          placeholder="My Visibilities"
          value={visibilityName}
          darker
          name="Visibility name"
          updateValue={updateVisibilityName}
        />
        <IconInput
          icon={visibilityIcon}
          setIcon={setVisibilityIcon}
          name="Visibility icon"
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
        setSelectedIcon={setVisibilityIcon}
      />
    </>
  )
}

export default ModifyVisibilityModal
