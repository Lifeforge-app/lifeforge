import { Button, NumberInput } from 'lifeforge-ui'

import { useInvoiceEditor } from '../../../providers/InvoiceEditorProvider'
import BaseColumn from './BaseColumn'

function DiscountColumn() {
  const { formData, currencySymbol, updateField, setShowDiscount } =
    useInvoiceEditor()

  return (
    <BaseColumn
      type="discount"
      onHide={() => {
        setShowDiscount(false)
        updateField('discount_amount', 0)
        updateField('discount_type', '')
      }}
    >
      {formData.discount_type === 'fixed' && (
        <span className="text-bg-500">{currencySymbol}</span>
      )}
      <NumberInput
        className="w-24"
        min={0}
        variant="plain"
        value={formData.discount_amount}
        onChange={val => updateField('discount_amount', val || 0)}
      />
      {formData.discount_type === 'rate' && (
        <span className="text-bg-500">%</span>
      )}
      <Button
        icon="tabler:exchange"
        variant="secondary"
        onClick={() => {
          updateField(
            'discount_type',
            formData.discount_type === 'rate' ? 'fixed' : 'rate'
          )
        }}
      />
    </BaseColumn>
  )
}

export default DiscountColumn
