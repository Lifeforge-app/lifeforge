/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconSelector from '@components/ButtonsAndInputs/IconSelector'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import APIRequest from '@utils/fetchData'

function ModifyModal({ stuff }: { stuff: string }): React.ReactElement {
  const {
    modifyDataModalOpenType: openType,
    setModifyDataModalOpenType: setOpenType,
    existedData,
    setExistedData,
    refreshData
  } = useProjectsMContext()[
    stuff.replace('y', 'ies') as 'categories' | 'technologies' | 'visibilities'
  ]
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setName(existedData.name)
          setIcon(existedData.icon)
        }
      } else {
        setName('')
        setIcon('')
      }
    }
  }, [openType, existedData])

  function updateVisibilityName(e: React.ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (name.trim().length === 0 || icon.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `projects-m/${stuff}${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name,
        icon
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshData()
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
          title={openType === 'update' ? `Edit ${stuff}` : `Add ${stuff}`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:book"
          placeholder={`Project ${stuff}`}
          value={name}
          darker
          name={`${stuff} name`}
          updateValue={updateVisibilityName}
        />
        <IconInput
          icon={icon}
          setIcon={setIcon}
          name={`${stuff} icon`}
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
        setSelectedIcon={setIcon}
      />
    </>
  )
}

export default ModifyModal
