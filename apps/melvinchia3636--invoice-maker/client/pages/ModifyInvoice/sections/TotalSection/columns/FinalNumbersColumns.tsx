import { CurrencyInput } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useInvoiceEditor } from '@/pages/ModifyInvoice/providers/InvoiceEditorProvider'

function FinalNumbersColumns() {
  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const {
    formData,
    currencySymbol,
    updateField,
    finalNumbers: { total, balanceDue }
  } = useInvoiceEditor()

  return (
    <>
      <div className="border-bg-200 dark:border-bg-700 border-t pt-3">
        <div className="flex justify-between font-semibold">
          <span>{t('inputs.total')}</span>
          <span>
            {currencySymbol}{' '}
            {total.toLocaleString('en-MY', {
              minimumFractionDigits: 2
            })}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <span className="text-bg-500">{t('inputs.amountPaid')}</span>
        <div className="flex items-center gap-2">
          <span className="text-bg-500">{currencySymbol}</span>
          <CurrencyInput
            className="w-24"
            placeholder="0.00"
            variant="plain"
            value={formData.amount_paid}
            onChange={val => updateField('amount_paid', val || 0)}
          />
        </div>
      </div>
      <div className="border-bg-200 dark:border-bg-700 border-t pt-3">
        <div className="flex justify-between text-lg font-bold">
          <span>{t('inputs.balanceDue')}</span>
          <span className="text-custom-500">
            {currencySymbol}{' '}
            {balanceDue.toLocaleString('en-MY', {
              minimumFractionDigits: 2
            })}
          </span>
        </div>
      </div>
    </>
  )
}

export default FinalNumbersColumns
