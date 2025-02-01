import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Modal from '@components/modals/Modal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import APIRequest from '@utils/fetchData'

function RawHTMLInputModal({
  isOpen,
  setIsOpen,
  refreshData
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  refreshData: () => void
}): React.ReactElement {
  const { t } = useTranslation('modules.openaiApiPricing')
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      raw: ''
    }
  )
  const FIELDS: IFieldProps[] = [
    {
      id: 'raw',
      label: 'raw html',
      icon: 'tabler:code',
      placeholder: t('inputs.rawHtml.placeholder'),
      type: 'text'
    }
  ]

  async function onSubmitButtonClick(): Promise<void> {
    const { raw } = data
    if (raw.trim() === '') {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    await APIRequest({
      endpoint: 'openai-api-pricing',
      method: 'POST',
      body: {
        raw
      },
      successInfo: 'fetch',
      failureInfo: 'fetch',
      callback: () => {
        refreshData()
        setIsOpen(false)
      }
    })
  }

  useEffect(() => {
    setData({ raw: '' })
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      fields={FIELDS}
      data={data}
      setData={setData}
      title="inputRawHtml"
      namespace="modules.openaiApiPricing"
      icon={'tabler:code'}
      submitButtonIcon="tabler:arrow-right"
      submitButtonLabel="Submit"
      submitButtonIconAtEnd
      onClose={() => {
        setIsOpen(false)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default RawHTMLInputModal
