import { t } from 'i18next'
import { cookieParse } from 'pocketbase'

export async function fetchChallenge(): Promise<string> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_HOST}/passwords/master/challenge`,
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
