import { Button, NumberInput } from 'lifeforge-ui'

import { useInvoiceEditor } from '../../../providers/InvoiceEditorProvider'
import BaseColumn from './BaseColumn'

function TaxColumn() {
  const { formData, currencySymbol, updateField, setShowTax } =
    useInvoiceEditor()

  return (
    <BaseColumn
      type="tax"
      onHide={() => {
        setShowTax(false)
        updateField('tax_amount', 0)
        updateField('tax_type', '')
      }}
    >
      {formData.tax_type === 'fixed' && (
        <span className="text-bg-500">{currencySymbol}</span>
      )}
      <NumberInput
        className="w-24"
        min={0}
        variant="plain"
        value={formData.tax_amount}
        onChange={val => updateField('tax_amount', val || 0)}
      />
      {formData.tax_type === 'rate' && <span className="text-bg-500">%</span>}
      <Button
        icon="tabler:exchange"
        variant="secondary"
        onClick={() => {
          updateField(
            'tax_type',
            formData.tax_type === 'rate' ? 'fixed' : 'rate'
          )
        }}
      />
    </BaseColumn>
  )
}

export default TaxColumn
