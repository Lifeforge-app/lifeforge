import { useDebounce } from '@uidotdev/usehooks'
import _ from 'lodash'
import { memo } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'

import { Button } from '@/components/inputs'
import { Box, Flex, Icon, Text } from '@/components/primitives'

function _ModalHeader({
  title,
  icon,
  onClose,
  className = '',
  hasAI = false,
  appendTitle,
  namespace = 'common.modals',
  headerActions
}: {
  title: string | React.ReactNode
  icon: string
  onClose: () => void
  hasAI?: boolean
  className?: string
  appendTitle?: React.ReactElement
  namespace?: string
  headerActions?: React.ReactNode
}) {
  const { t } = useModuleTranslation(namespace ? [namespace] : [])
  // Add some delay to prevent the title and icon to become empty
  // when the modal is transitioned
  const innerTitle = useDebounce(title, 100)
  const innerIcon = useDebounce(icon, 100)

  return (
    <Flex
      align="center"
      className={className}
      justify="between"
      mb="md"
      style={{ gap: '0.75rem' }}
    >
      <Text asChild size="xl" weight="semibold">
        <Flex
          align="center"
          as="h1"
          minWidth="0"
          style={{ gap: '0.75rem' }}
          width="100%"
        >
          <Icon icon={innerIcon} size="1.5em" />
          {typeof innerTitle === 'string' ? (
            <>
              <Text truncate as="span" style={{ minWidth: 0 }}>
                {t([
                  `modals.${_.camelCase(innerTitle)}.title`,
                  `modals.${_.camelCase(innerTitle)}`,
                  `${_.camelCase(innerTitle)}.title`,
                  `${_.camelCase(innerTitle)}`,
                  `${innerTitle}.title`,
                  `${innerTitle}`,
                  `modals.${innerTitle}.title`,
                  `modals.${innerTitle}`,
                  innerTitle
                ])}
              </Text>
              {appendTitle}
              {hasAI && (
                <Box
                  asChild
                  flexShrink="0"
                  style={{
                    color: '#eab308',
                    height: '1.25rem',
                    width: '1.25rem'
                  }}
                >
                  <Icon icon="mage:stars-c" />
                </Box>
              )}
            </>
          ) : (
            innerTitle
          )}
        </Flex>
      </Text>
      <Flex align="center" gap="sm">
        {headerActions}
        <Button
          icon="tabler:x"
          style={{ padding: '0.75rem' }}
          variant="plain"
          onClick={onClose}
        />
      </Flex>
    </Flex>
  )
}

export const ModalHeader = memo(_ModalHeader)
