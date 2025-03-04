import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import {
  ColorInput,
  IconPickerModal,
  ColorPickerModal,
  IconInput,
  TextInput
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IProjectsMKanbanColumn } from '@interfaces/projects_m_interfaces'
import fetchAPI from '@utils/fetchAPI'

function ModifyColumnModal({
  openType,
  setOpenType,
  existedData,
  setExistedData,
  refreshColumns
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IProjectsMKanbanColumn | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IProjectsMKanbanColumn | null>
  >
  refreshColumns: () => void
}): React.ReactElement {
  const { t } = useTranslation('modules.projectsM')
  const { id } = useParams()
  const [columnName, setColumnName] = useState('')
  const [columnIcon, setColumnIcon] = useState('')
  const [columnColor, setColumnColor] = useState<string>('#FFFFFF')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setColumnName(existedData.name)
          setColumnIcon(existedData.icon)
          setColumnColor(existedData.color)
        }
      } else {
        setColumnName('')
        setColumnIcon('')
        setColumnColor('#FFFFFF')
      }
    }
  }, [openType, existedData])

  async function onSubmitButtonClick(): Promise<void> {
    if (
      columnName.trim().length === 0 ||
      !columnColor ||
      columnIcon.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setIsLoading(true)

    try {
      await fetchAPI(
        `projects-m/kanban/column${
          openType === 'update' ? `/${existedData?.id}` : `/${id}`
        }`,
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: {
            name: columnName,
            icon: columnIcon,
            color: columnColor
          }
        }
      )

      refreshColumns()
      setExistedData(null)
      setOpenType(null)
    } catch {
      toast.error(t('input.error.failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ModalWrapper className="sm:min-w-[30rem]" isOpen={openType !== null}>
        <ModalHeader
          icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
          namespace="modules.projectsM"
          title={`column.${openType}`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <TextInput
          darker
          icon="tabler:book"
          name="Column name"
          namespace="modules.projectsM"
          placeholder="My Columns"
          setValue={setColumnName}
          value={columnName}
        />
        <IconInput
          icon={columnIcon}
          name="Column icon"
          namespace="modules.projectsM"
          setIcon={setColumnIcon}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <ColorInput
          color={columnColor}
          name="Column color"
          namespace="modules.projectsM"
          setColor={setColumnColor}
          setColorPickerOpen={setColorPickerOpen}
        />
        <CreateOrModifyButton
          loading={isLoading}
          type={openType}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        />
      </ModalWrapper>
      <IconPickerModal
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setColumnIcon}
      />
      <ColorPickerModal
        color={columnColor}
        isOpen={colorPickerOpen}
        setColor={setColumnColor}
        setOpen={setColorPickerOpen}
      />
    </>
  )
}

export default ModifyColumnModal
