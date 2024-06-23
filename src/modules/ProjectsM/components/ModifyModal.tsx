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
import { type IProjectsMStatus } from '@interfaces/projects_m_interfaces'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import APIRequest from '@utils/fetchData'

function ModifyModal({
  stuff
}: {
  stuff: 'category' | 'technology' | 'visibility' | 'status'
}): React.ReactElement {
  const {
    modifyDataModalOpenType: openType,
    setModifyDataModalOpenType: setOpenType,
    existedData,
    setExistedData,
    refreshData
  } = useProjectsMContext()[
    stuff.replace('y', 'ies').replace('us', 'uses') as
      | 'categories'
      | 'technologies'
      | 'visibilities'
      | 'statuses'
  ]
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [color, setColor] = useState<string>('#FFFFFF')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setName(existedData.name)
          setIcon(existedData.icon)
          if (stuff === 'status') {
            setColor((existedData as IProjectsMStatus).color)
          }
        }
      } else {
        setName('')
        setIcon('')
        setColor('#FFFFFF')
      }
    }
  }, [openType, existedData])

  function updateVisibilityName(e: React.ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value)
  }

  function updateColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setColor(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      name.trim().length === 0 ||
      icon.trim().length === 0 ||
      (stuff === 'status' && !color)
    ) {
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
        icon,
        ...(stuff === 'status' && { color })
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
        {stuff === 'status' && (
          <ColorInput
            color={color}
            name="Status color"
            setColorPickerOpen={setColorPickerOpen}
            updateColor={updateColor}
          />
        )}
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
      {stuff === 'status' && (
        <ColorPickerModal
          isOpen={colorPickerOpen}
          setOpen={setColorPickerOpen}
          setColor={setColor}
          color={color}
        />
      )}
    </>
  )
}

export default ModifyModal
