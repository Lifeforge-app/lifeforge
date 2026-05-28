import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/inputs'
import { Box, Flex, Text } from '@components/primitives'

export function SSOHeader({
  icon,
  namespace,
  link,
  className,
  actionButtonProps
}: {
  icon: string
  namespace: string
  link: string
  className?: string
  actionButtonProps?: React.ComponentProps<typeof Button>
}) {
  const { t } = useTranslation(namespace)

  return (
    <Flex
      align="center"
      as="header"
      className={className}
      justify="between"
      p="3xl"
      width="100%"
    >
      <Flex align="center" gap="sm">
        <Icon
          height="2.25rem"
          icon={icon}
          style={{ color: 'var(--color-custom-400)' }}
          width="2.25rem"
        />
        <Box>
          <Text size="xl" weight="semibold">
            LifeForge
            <Text as="span" color="custom-400">
              .
            </Text>
          </Text>
          <Text color="muted" size="sm" weight="medium">
            {t('title')}
          </Text>
        </Box>
      </Flex>
      <Flex align="center" gap="lg">
        {actionButtonProps && <Button {...actionButtonProps} />}
        <Button
          as="a"
          href={link}
          icon="uil:github"
          iconStyle={{ width: '1.5em', height: '1.5em' }}
          rel="noopener noreferrer"
          target="_blank"
          variant="plain"
        >
          {t('github')}
        </Button>
      </Flex>
    </Flex>
  )
}
