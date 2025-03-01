import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import FormModal from '@components/modals/FormModal'
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
  const FIELDS: IFieldProps<typeof data>[] = [
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
    <FormModal
      submitButtonIconAtEnd
      data={data}
      fields={FIELDS}
      icon={'tabler:code'}
      isOpen={isOpen}
      namespace="modules.openaiApiPricing"
      setData={setData}
      submitButtonIcon="tabler:arrow-right"
      submitButtonLabel="Submit"
      title="inputRawHtml"
      onClose={() => {
        setIsOpen(false)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default RawHTMLInputModal
