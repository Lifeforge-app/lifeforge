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
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import APIRequest from '@utils/fetchData'

function ModifyStatusModal(): React.ReactElement {
  const {
    statuses: {
      refreshData: refreshStatuses,
      modifyDataModalOpenType: openType,
      setModifyDataModalOpenType: setOpenType,
      existedData,
      setExistedData
    }
  } = useProjectsMContext()
  const [statusName, setStatusName] = useState('')
  const [statusIcon, setStatusIcon] = useState('')
  const [statusColor, setStatusColor] = useState<string>('#FFFFFF')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setStatusName(existedData.name)
          setStatusIcon(existedData.icon)
          setStatusColor(existedData.color)
        }
      } else {
        setStatusName('')
        setStatusIcon('')
        setStatusColor('#FFFFFF')
      }
    }
  }, [openType, existedData])

  function updateStatusName(e: React.ChangeEvent<HTMLInputElement>): void {
    setStatusName(e.target.value)
  }

  function updateStatusColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setStatusColor(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      statusName.trim().length === 0 ||
      !statusColor ||
      statusIcon.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setIsLoading(true)
    await APIRequest({
      endpoint: `projects-m/status${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name: statusName,
        icon: statusIcon,
        color: statusColor
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshStatuses()
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
          title={openType === 'update' ? 'Edit Status' : 'Add Status'}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:book"
          placeholder="My Statuses"
          value={statusName}
          darker
          name="Status name"
          updateValue={updateStatusName}
        />
        <IconInput
          icon={statusIcon}
          setIcon={setStatusIcon}
          name="Status icon"
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <ColorInput
          color={statusColor}
          name="Status color"
          setColorPickerOpen={setColorPickerOpen}
          updateColor={updateStatusColor}
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
        setSelectedIcon={setStatusIcon}
      />
      <ColorPickerModal
        color={statusColor}
        isOpen={colorPickerOpen}
        setColor={setStatusColor}
        setOpen={setColorPickerOpen}
      />
    </>
  )
}

export default ModifyStatusModal
