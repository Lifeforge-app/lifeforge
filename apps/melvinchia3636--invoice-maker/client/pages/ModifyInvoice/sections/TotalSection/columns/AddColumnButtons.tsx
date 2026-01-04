import { Button } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useInvoiceEditor } from '@/pages/ModifyInvoice/providers/InvoiceEditorProvider'

function AddColumnButtons() {
  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const {
    showDiscount,
    setShowDiscount,
    showTax,
    setShowTax,
    showShipping,
    setShowShipping,
    updateField
  } = useInvoiceEditor()

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {(
        [
          [
            'discount',
            showDiscount,
            setShowDiscount,
            () => updateField('discount_type', 'rate')
          ],
          ['tax', showTax, setShowTax, () => updateField('tax_type', 'rate')],
          ['shipping', showShipping, setShowShipping]
        ] as const
      ).map(
        ([type, show, setShow, onClick]) =>
          !show && (
            <Button
              key={type}
              className="flex-1"
              icon="tabler:plus"
              variant="tertiary"
              onClick={() => {
                setShow(true)
                onClick?.()
              }}
            >
              {t(`inputs.${type}`)}
            </Button>
          )
      )}
    </div>
  )
}

export default AddColumnButtons
