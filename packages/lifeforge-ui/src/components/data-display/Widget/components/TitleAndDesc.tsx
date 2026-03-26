import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import { Box, Text } from '@components/primitives'

import * as styles from '../Widget.css'

function TitleAndDesc({
  title,
  description,
  namespace = 'common.dashboard',
  variant = 'default'
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  namespace?: string | false
  variant?: 'default' | 'large-icon'
}) {
  const { t } = useTranslation(namespace === false ? [] : [namespace])

  return (
    <Box minWidth="0">
      <Text
        truncate
        as="h3"
        className={
          variant !== 'large-icon' ? styles.titleTextDefault : undefined
        }
        size={variant === 'large-icon' ? { base: 'lg', sm: 'xl' } : 'lg'}
        style={{ width: '100%', minWidth: 0 }}
        weight="semibold"
      >
        {namespace !== false && typeof title === 'string'
          ? t([
              `widgets.${_.camelCase(title)}.title`,
              `widgets.${_.camelCase(title)}`,
              title
            ])
          : title}
      </Text>
      {description && (
        <Text
          as="p"
          color="bg-500"
          size={variant === 'large-icon' ? 'base' : 'sm'}
          style={{ width: '100%', minWidth: 0 }}
        >
          {namespace !== false && typeof description === 'string'
            ? t([
                `widgets.${_.camelCase(description)}.description`,
                `widgets.${_.camelCase(description)}`,
                description
              ])
            : description}
        </Text>
      )}
    </Box>
  )
}

export default TitleAndDesc
