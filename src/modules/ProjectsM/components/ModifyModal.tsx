/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import IconSelector from '@components/ButtonsAndInputs/IconSelector/IconPicker'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IProjectsMStatus } from '@interfaces/projects_m_interfaces'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import APIRequest from '@utils/fetchData'

function ModifyModal({
  stuff
}: {
  stuff: 'categories' | 'technologies' | 'visibilities' | 'statuses'
}): React.ReactElement {
  const {
    modifyDataModalOpenType: openType,
    setModifyDataModalOpenType: setOpenType,
    existedData,
    setExistedData,
    refreshData
  } = useProjectsMContext()[stuff]
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [color, setColor] = useState<string>('#FFFFFF')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const singleStuff = {
    categories: 'category',
    technologies: 'technology',
    visibilities: 'visibility',
    statuses: 'status'
  }[stuff]

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setName(existedData.name)
          setIcon(existedData.icon)
          if (stuff === 'statuses') {
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
      (stuff === 'statuses' && !color)
    ) {
      toast.error(t('input.error.fieldEmpty'))
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
        ...(stuff === 'statuses' && { color })
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
          title={
            openType === 'update' ? `Edit ${singleStuff}` : `Add ${singleStuff}`
          }
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          icon="tabler:book"
          placeholder={`Project ${singleStuff}`}
          value={name}
          darker
          name={`${singleStuff} name`}
          updateValue={updateVisibilityName}
        />
        <IconInput
          icon={icon}
          setIcon={setIcon}
          name={`${singleStuff} icon`}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        {stuff === 'statuses' && (
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
      {stuff === 'statuses' && (
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
