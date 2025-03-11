import fetchAPI from '@utils/fetchAPI'
import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'

import { type IFieldProps } from '@interfaces/modal_interfaces'

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

    try {
      await fetchAPI('openai-api-pricing', {
        method: 'POST',
        body: { raw }
      })
      refreshData()
      setIsOpen(false)
    } catch {
      toast.error('Failed to submit')
    }
  }

  useEffect(() => {
    setData({ raw: '' })
  }, [isOpen])

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon={'tabler:code'}
      isOpen={isOpen}
      namespace="modules.openaiApiPricing"
      setData={setData}
      submitButtonProps={{
        children: 'submit',
        icon: 'tabler:arrow-right',
        iconAtEnd: true
      }}
      title="inputRawHtml"
      onClose={() => {
        setIsOpen(false)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default RawHTMLInputModal
