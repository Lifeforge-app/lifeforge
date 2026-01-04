import { Button } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

interface ColumnProps {
  children: React.ReactNode
  type: 'tax' | 'shipping' | 'discount'
  onHide: () => void
}

function BaseColumn({ children, type, onHide }: ColumnProps) {
  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <span className="text-bg-500">{t(`inputs.${type}`)}</span>
      <div className="flex items-center gap-2">
        {children}
        <Button
          dangerous
          icon="tabler:x"
          variant="secondary"
          onClick={onHide}
        />
      </div>
    </div>
  )
}

export default BaseColumn
