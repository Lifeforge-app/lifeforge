import dayjs from 'dayjs'

import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Flex, Text } from '@lifeforge/ui'

import type { PasswordEntry } from '../../..'

function DecryptedPasswordDisplay({
  decryptedPassword,
  password
}: {
  decryptedPassword: string | null
  password: PasswordEntry
}) {
  const { t } = useModuleTranslation()

  const isExpired =
    password.rotation_interval === -1
      ? false
      : dayjs(password.last_password_updated).isBefore(
          dayjs().subtract(password.rotation_interval, 'days')
        )

  return (
    <Flex align="end" direction="column" gap="sm" mr="md">
      {decryptedPassword === null ? (
        <Flex
          align="center"
          as="code"
          display={{ base: 'none', md: 'flex' }}
          gap="xs"
          style={{
            fontFamily: 'Arial',
            fontSize: '3rem',
            letterSpacing: '-0.05em',
            userSelect: 'text'
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Box
              key={i}
              bg={{ base: 'bg-500', dark: 'bg-100' }}
              r="full"
              style={{ width: '0.375rem', height: '0.375rem' }}
            />
          ))}
        </Flex>
      ) : (
        <Box asChild maxWidth="24rem" minWidth="0">
          <Text
            truncate
            as="code"
            display={{ base: 'none', lg: 'block' }}
            size="lg"
            style={{ userSelect: 'text' }}
          >
            {decryptedPassword}
          </Text>
        </Box>
      )}
      <Text
        color={isExpired ? 'red-500' : 'muted'}
        display={{ base: 'none', md: 'block' }}
        size="sm"
      >
        {t('lastUpdated')}: {dayjs(password.last_password_updated).fromNow()}
      </Text>
    </Flex>
  )
}

export default DecryptedPasswordDisplay
