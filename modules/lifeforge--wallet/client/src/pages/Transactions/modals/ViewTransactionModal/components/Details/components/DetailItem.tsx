import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Flex, Icon, Text, surface } from '@lifeforge/ui'

function DetailItem({
  icon,
  label,
  vertical = false,
  children
}: {
  icon: string
  label: string
  vertical?: boolean
  children: React.ReactElement
}) {
  const { t } = useModuleTranslation()

  return (
    <Card
      bg={surface.light}
      direction={vertical ? 'column' : { base: 'column', sm: 'row' }}
      gap="xl"
      justify="between"
      minWidth="0"
      width="100%"
    >
      <Flex align="center" color="muted" gap="md" minWidth="0">
        <Icon icon={icon} size="1.5rem" />
        <Text truncate as="h3" size="lg" weight="medium">
          {t(`inputs.${label}`)}
        </Text>
      </Flex>
      {children}
    </Card>
  )
}

export default DetailItem
