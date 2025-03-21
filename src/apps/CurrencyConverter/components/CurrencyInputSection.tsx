import { CurrencyInput } from '@lifeforge/ui'

interface CurrencyInputSectionProps {
  amount: string
  setAmount: (value: string) => void
}

function CurrencyInputSection({
  amount,
  setAmount
}: CurrencyInputSectionProps) {
  return (
    <div className="mt-6 mb-6">
      <CurrencyInput
        darker
        required
        icon="tabler:cash"
        name="Amount"
        namespace="apps.currencyConverter"
        placeholder="0.00"
        setValue={value => {
          setAmount(value || '0')
        }}
        value={amount}
      />
    </div>
  )
}

export default CurrencyInputSection
