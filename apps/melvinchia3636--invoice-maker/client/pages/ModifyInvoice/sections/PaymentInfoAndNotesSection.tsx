import { useQuery } from '@tanstack/react-query'
import { Card, TextAreaInput, WithQuery } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import forgeAPI from '@/utils/forgeAPI'

import { useInvoiceEditor } from '../providers/InvoiceEditorProvider'

function PaymentInfoAndNotesSection() {
  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const settingsQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.settings.get.queryOptions()
  )

  const { formData, updateField } = useInvoiceEditor()

  return (
    <WithQuery query={settingsQuery}>
      {settings => (
        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 font-medium">{t('inputs.paymentInfo')}</h3>
            <p className="text-bg-500">
              {settings.bank_name && (
                <>
                  Bank: {settings.bank_name}
                  <br />
                </>
              )}
              {settings.bank_account && <>A/C No.: {settings.bank_account}</>}
            </p>
          </Card>

          <Card>
            <h3 className="mb-3 font-medium">{t('inputs.notes')}</h3>
            <TextAreaInput
              icon="tabler:note"
              label="Notes"
              placeholder="Payment instructions, terms, etc."
              variant="plain"
              value={formData.notes}
              onChange={e => updateField('notes', e)}
            />
          </Card>
        </div>
      )}
    </WithQuery>
  )
}

export default PaymentInfoAndNotesSection
