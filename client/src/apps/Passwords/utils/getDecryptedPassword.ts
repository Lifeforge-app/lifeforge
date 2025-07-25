import { parse as parseCookie } from 'cookie'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import { decrypt, encrypt } from '../../../core/security/utils/encryption'

export async function getDecryptedPassword(
  masterPassword: string,
  id: string
): Promise<string> {
  const challenge = await fetchAPI<string>(
    import.meta.env.VITE_API_HOST,
    'passwords/entries/challenge'
  )

  const encryptedMaster = encrypt(masterPassword, challenge)

  const decrypted = await fetch(
    `${import.meta.env.VITE_API_HOST}/passwords/entries/decrypt/${id}?master=${encodeURIComponent(
      encryptedMaster
    )}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parseCookie(document.cookie).session}`
      }
    }
  )
    .then(async res => {
      const data = await res.json()

      if (res.ok && data.state === 'success') {
        return decrypt(data.data, challenge)
      } else {
        throw new Error(data.message)
      }
    })
    .catch(err => {
      toast.error('Couldn’t fetch the password. Please try again.')
      console.error(err)
    })

  return decrypted ?? ''
}
