import { DashboardItem } from 'lifeforge-ui'
import type { WidgetConfig } from 'shared'

function ExampleWidget() {
  return (
    <DashboardItem
      icon="{{moduleIcon}}"
      namespace="apps.{{kabab moduleName.en}}"
      title="{{moduleName.en}}"
    >
      Hello World!
    </DashboardItem>
  )
}

export default ExampleWidget

export const config: WidgetConfig = {
  namespace: 'apps.{{kabab moduleName.en}}',
  id: '{{kabab moduleName.en}}',
  icon: '{{moduleIcon}}',
  minH: 1,
  minW: 1
}
