import { useCallback, useEffect, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { toast } from '@lifeforge/ui'

import { useVEKContext } from '@/providers/VEKProvider'
import { decrypt } from '@/utils/crypto'

export default function useDecryptPassword(encryptedPassword: string) {
  const vek = useVEKContext()
  const { t } = useModuleTranslation()

  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  )

  useEffect(() => {
    setDecryptedPassword(null)
  }, [encryptedPassword])

  const toggleDecrypt = useCallback(async () => {
    if (decryptedPassword !== null) {
      setDecryptedPassword(null)

      return
    }

    if (!vek) {
      toast.error(t('toasts.decryptFailed'))

      return
    }

    try {
      const result = await decrypt(encryptedPassword, vek)
      setDecryptedPassword(result)
    } catch {
      toast.error(t('toasts.decryptFailed'))
      setDecryptedPassword(null)
    }
  }, [vek, encryptedPassword])

  return { decryptedPassword, toggleDecrypt, setDecryptedPassword }
}
