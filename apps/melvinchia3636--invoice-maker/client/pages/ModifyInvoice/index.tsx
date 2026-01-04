import { Button, GoBackButton } from 'lifeforge-ui'
import { useNavigate } from 'shared'

import InvoiceEditorProvider, {
  useInvoiceEditor
} from './providers/InvoiceEditorProvider'
import Header from './sections/HeaderSection'
import LineItemsSection from './sections/LineItemsSection'
import PaymentInfoAndNotesSection from './sections/PaymentInfoAndNotesSection'
import TopInfoSection from './sections/TopInfoSection'
import TotalSection from './sections/TotalSection'

function ModifyInvoiceContent() {
  const navigate = useNavigate()

  const { isEditMode, handleSubmit, isLoading } = useInvoiceEditor()

  return (
    <>
      <GoBackButton
        onClick={() => navigate('/melvinchia3636--invoice-maker')}
      />
      <Header />
      <div className="w-full space-y-6 pb-8">
        <TopInfoSection />
        <LineItemsSection />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PaymentInfoAndNotesSection />
          <TotalSection />
        </div>
        <Button
          className="w-full"
          icon={isEditMode ? 'tabler:device-floppy' : 'tabler:plus'}
          loading={isLoading}
          namespace="apps.melvinchia3636__invoiceMaker"
          onClick={handleSubmit}
        >
          {isEditMode ? 'Save Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </>
  )
}

export default function ModifyInvoice() {
  return (
    <InvoiceEditorProvider>
      <ModifyInvoiceContent />
    </InvoiceEditorProvider>
  )
}
