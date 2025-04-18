import { parse as parseCookie } from 'cookie'
import { t } from 'i18next'
import { toast } from 'react-toastify'

export async function fetchChallenge(): Promise<string> {
  return await fetch(
    `${import.meta.env.VITE_API_HOST}/api-keys/auth/challenge`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${parseCookie(document.cookie).session}`
      }
    }
  ).then(async res => {
    const data = await res.json()
    if (res.ok && data.state === 'success') {
      return data.data
    } else {
      toast.error(t('apiKeys.failedToUnlock'))

      throw new Error(t('apiKeys.failedToUnlock'))
    }
  })
}
