import { Card } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useInvoiceEditor } from '../../providers/InvoiceEditorProvider'
import AddColumnButtons from './columns/AddColumnButtons'
import DiscountColumn from './columns/DiscountColumn'
import FinalNumbersColumns from './columns/FinalNumbersColumns'
import ShippingColumn from './columns/ShippingColumn'
import TaxColumn from './columns/TaxColumn'

function TotalSection() {
  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const {
    currencySymbol,
    showDiscount,
    showTax,
    showShipping,
    finalNumbers: { subtotal }
  } = useInvoiceEditor()

  return (
    <Card className="bg-bg-50 dark:bg-bg-800/50 rounded-lg p-4">
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-bg-500">{t('inputs.subtotal')}</span>
          <span>
            {currencySymbol}{' '}
            {subtotal.toLocaleString('en-MY', {
              minimumFractionDigits: 2
            })}
          </span>
        </div>
        <AddColumnButtons />
        {showDiscount && <DiscountColumn />}
        {showTax && <TaxColumn />}
        {showShipping && <ShippingColumn />}
        <FinalNumbersColumns />
      </div>
    </Card>
  )
}

export default TotalSection
