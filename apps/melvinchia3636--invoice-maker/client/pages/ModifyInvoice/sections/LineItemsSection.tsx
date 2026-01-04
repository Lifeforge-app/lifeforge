import clsx from 'clsx'
import {
  Button,
  Card,
  CurrencyInput,
  NumberInput,
  TextInput
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useInvoiceEditor } from '../providers/InvoiceEditorProvider'

function LineItemsSection() {
  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const {
    formData,
    updateLineItem,
    currencySymbol,
    removeLineItem,
    addLineItem
  } = useInvoiceEditor()

  return (
    <Card>
      {/* Desktop header - hidden on mobile */}
      <div className="bg-bg-300 dark:bg-bg-700 text-bg-800 dark:text-bg-100 hidden grid-cols-12 gap-4 p-4 text-sm font-medium lg:grid">
        <div className="col-span-6">{t('inputs.item')}</div>
        <div className="col-span-2 text-center">{t('inputs.quantity')}</div>
        <div className="col-span-2 text-center">{t('inputs.rate')}</div>
        <div className="col-span-2 pr-16 text-right">{t('inputs.amount')}</div>
      </div>
      <div className="divide-bg-200 dark:divide-bg-700/50 divide-y px-4 lg:pt-4">
        {formData.items.map((item, index) => (
          <div key={index} className="group relative py-6 lg:py-4">
            {/* Mobile layout - stacked */}
            <div className="flex flex-col gap-3 lg:hidden">
              <div>
                <label className="text-bg-500 mb-1 block text-sm">
                  {t('inputs.item')}
                </label>
                <TextInput
                  placeholder="Item description"
                  variant="plain"
                  value={item.description}
                  onChange={val => updateLineItem(index, 'description', val)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-bg-500 mb-1 block text-sm">
                    {t('inputs.quantity')}
                  </label>
                  <NumberInput
                    min={0}
                    variant="plain"
                    value={item.quantity}
                    onChange={val =>
                      updateLineItem(index, 'quantity', val || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-bg-500 mb-1 block text-sm">
                    {t('inputs.rate')}
                  </label>
                  <CurrencyInput
                    currency={currencySymbol}
                    placeholder="0.00"
                    variant="plain"
                    value={item.rate}
                    onChange={val => updateLineItem(index, 'rate', val || 0)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bg-500">{t('inputs.amount')}:</span>
                <span className="font-medium">
                  {currencySymbol}{' '}
                  {(item.quantity * item.rate).toLocaleString('en-MY', {
                    minimumFractionDigits: 2
                  })}
                </span>
              </div>
            </div>

            {/* Desktop layout - grid */}
            <div className="hidden grid-cols-12 items-center gap-4 lg:grid">
              <div className="col-span-6">
                <TextInput
                  placeholder="Item description"
                  variant="plain"
                  value={item.description}
                  onChange={val => updateLineItem(index, 'description', val)}
                />
              </div>
              <div className="col-span-2 text-center">
                <NumberInput
                  min={0}
                  variant="plain"
                  value={item.quantity}
                  onChange={val => updateLineItem(index, 'quantity', val || 0)}
                />
              </div>
              <div className="col-span-2 text-center">
                <CurrencyInput
                  currency={currencySymbol}
                  placeholder="0.00"
                  variant="plain"
                  value={item.rate}
                  onChange={val => updateLineItem(index, 'rate', val || 0)}
                />
              </div>
              <div className="col-span-2 flex items-center justify-end pr-16 text-right">
                <span className="font-medium">
                  {currencySymbol}{' '}
                  {(item.quantity * item.rate).toLocaleString('en-MY', {
                    minimumFractionDigits: 2
                  })}
                </span>
              </div>
            </div>

            {/* Delete button */}
            <Button
              className={clsx(
                'absolute top-0 right-0 text-red-500 md:opacity-0 md:transition-opacity md:group-hover:opacity-100',
                formData.items.length === 1 && 'invisible'
              )}
              icon="tabler:trash"
              variant="plain"
              onClick={() => removeLineItem(index)}
            />
          </div>
        ))}
      </div>
      <div className="p-4">
        <Button
          className="w-full"
          icon="tabler:plus"
          variant="secondary"
          onClick={addLineItem}
        >
          {t('inputs.addLineItem')}
        </Button>
      </div>
    </Card>
  )
}

export default LineItemsSection
