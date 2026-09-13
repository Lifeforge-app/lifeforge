import type { PasswordEntry } from '@'

import { usePromiseLoading } from '@lifeforge/api'
import { Box, Card, Flex, Icon } from '@lifeforge/ui'

import { useDecryptPassword } from '@/hooks'

import DecryptedPasswordDisplay from './components/DecryptedPasswordDisplay'
import PasswordActions from './components/PasswordActions'
import PasswordInfo from './components/PasswordInfo'

function PasswordEntryItem({
  password,
  pinPassword
}: {
  password: PasswordEntry
  pinPassword: (id: string) => Promise<void>
}) {
  const { decryptedPassword, toggleDecrypt, setDecryptedPassword } =
    useDecryptPassword(password.password)

  const [decryptLoading, onDecrypt] = usePromiseLoading(toggleDecrypt)

  return (
    <Card>
      {password.pinned && (
        <Box
          asChild
          left="0"
          position="absolute"
          style={{ transform: 'translate(-50%, -50%) rotate(-90deg)' }}
          top="0"
        >
          <Icon color="custom-500" icon="tabler:pin-filled" size="1.5em" />
        </Box>
      )}
      <Flex align="center" flex="1" gap="sm">
        <PasswordInfo password={password} />
        <Flex align="center" flexShrink="0" gap="xs" pt="sm">
          <DecryptedPasswordDisplay
            decryptedPassword={decryptedPassword}
            password={password}
          />
          <PasswordActions
            decryptedPassword={decryptedPassword}
            decryptLoading={decryptLoading}
            password={password}
            pinPassword={pinPassword}
            setDecryptedPassword={setDecryptedPassword}
            onDecrypt={onDecrypt}
          />
        </Flex>
      </Flex>
      {decryptedPassword !== null && (
        <Box
          as="code"
          bg="bg-800"
          display={{ base: 'block', lg: 'none' }}
          mt="md"
          p="md"
          r="md"
          style={{ wordBreak: 'break-all' }}
        >
          {decryptedPassword}
        </Box>
      )}
    </Card>
  )
}

export default PasswordEntryItem
