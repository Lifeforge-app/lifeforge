import { cookieParse } from 'pocketbase'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export async function fetchChallenge(
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<string> {
  const { t } = useTranslation()

  return await fetch(
    `${import.meta.env.VITE_API_HOST}/api-keys/auth/challenge`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    }
  ).then(async res => {
    const data = await res.json()
    if (res.ok && data.state === 'success') {
      return data.data
    } else {
      toast.error(t('apiKeys.failedToUnlock'))
      if (setLoading !== undefined) {
        setLoading(false)
      }

      throw new Error(t('apiKeys.failedToUnlock'))
    }
  })
}
