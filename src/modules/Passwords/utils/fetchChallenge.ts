import { cookieParse } from 'pocketbase'
import { useTranslation } from 'react-i18next'

export async function fetchChallenge(
  type: 'master' | 'password'
): Promise<string> {
  const { t } = useTranslation()
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_HOST}/passwords/${type}/challenge`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )

    const data = await response.json()
    if (response.ok && data.state === 'success') {
      return data.data
    } else {
      throw new Error(t('vault.failedToUnlock'))
    }
  } catch (error) {
    console.error('Error fetching challenge:', error)
    throw new Error(t('vault.failedToUnlock'))
  }
}
