import { Widget } from 'lifeforge-ui'
import type { WidgetConfig } from 'shared'

function ExampleWidget() {
  return (
    <Widget
      icon="{{moduleIcon}}"
      namespace="apps.{{camel moduleName.en}}"
      title="{{moduleName.en}}"
    >
      Hello World!
    </Widget>
  )
}

export default ExampleWidget

export const config: WidgetConfig = {
  namespace: 'apps.{{camel moduleName.en}}',
  id: '{{kebab moduleName.en}}',
  icon: '{{moduleIcon}}',
  minH: 1,
  minW: 1
}
