import copy from 'copy-to-clipboard'
import { useCallback, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { toast } from '@lifeforge/ui'

import { useVEKContext } from '@/providers/VEKProvider'
import { decrypt } from '@/utils/crypto'

export default function useCopyPassword() {
  const vek = useVEKContext()
  const { t } = useModuleTranslation()
  const [copyLoading, setCopyLoading] = useState(false)

  const copyPassword = useCallback(
    async (encryptedPassword: string, decryptedPassword?: string | null) => {
      setCopyLoading(true)

      if (decryptedPassword) {
        copy(decryptedPassword)
        toast.success(t('toasts.passwordCopied'))
      } else if (vek) {
        const result = await decrypt(encryptedPassword, vek)
        copy(result)
        toast.success(t('toasts.passwordCopied'))
      }

      setCopyLoading(false)
    },
    [vek, t]
  )

  return { copyPassword, copyLoading }
}
