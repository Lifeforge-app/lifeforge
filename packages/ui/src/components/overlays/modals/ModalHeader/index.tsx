import { useDebounce } from '@uidotdev/usehooks'
import _ from 'lodash'

import { useModuleTranslation } from '@lifeforge/localization'

import { Button } from '@/components/inputs'
import { Flex, Icon, Text } from '@/components/primitives'

function getLocaleKeys(innerTitle: string, namespace?: string) {
  return [
    `modals.${_.camelCase(innerTitle)}.title`,
    `modals.${_.camelCase(innerTitle)}`,
    `${_.camelCase(innerTitle)}.title`,
    `${_.camelCase(innerTitle)}`,
    `${innerTitle}.title`,
    `${innerTitle}`,
    `modals.${innerTitle}.title`,
    `modals.${innerTitle}`
  ].map(e => (namespace ? `${namespace}:${e}` : e))
}

export function ModalHeader({
  title,
  subtitle,
  icon,
  onClose,
  className = '',
  appendTitle,
  namespace = 'common.modals',
  trailing
}: {
  title: string | React.ReactNode
  subtitle?: React.ReactNode
  icon: string
  onClose: () => void
  className?: string
  appendTitle?: React.ReactElement
  namespace?: string | false
  trailing?: React.ReactNode
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
      <Flex align="center" minWidth="0" style={{ gap: '0.75rem' }} width="100%">
        <Icon icon={innerIcon} size={subtitle ? '2em' : '1.5em'} />
        <Flex direction="column" minWidth="0" width="100%">
          <Text asChild size="xl" weight="semibold">
            <Flex
              align="center"
              as="h1"
              minWidth="0"
              style={{ gap: '0.75rem' }}
              width="100%"
            >
              {typeof innerTitle === 'string' ? (
                <>
                  <Text truncate as="span" style={{ minWidth: 0 }}>
                    {namespace === false
                      ? innerTitle
                      : t(
                          [
                            ...getLocaleKeys(innerTitle),
                            ...(namespace
                              ? getLocaleKeys(innerTitle, namespace)
                              : []),
                            ...getLocaleKeys(innerTitle, 'common.modals')
                          ],
                          {
                            defaultValue: innerTitle
                          }
                        )}
                  </Text>
                  {appendTitle}
                </>
              ) : (
                innerTitle
              )}
            </Flex>
          </Text>
          {subtitle && (
            <Text color="muted" size={{ base: 'sm', sm: 'base' }}>
              {subtitle}
            </Text>
          )}
        </Flex>
      </Flex>
      <Flex align="center" gap="sm">
        {trailing}
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
