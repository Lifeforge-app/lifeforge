import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'
import { decrypt, encrypt } from '@utils/encryption'
import { fetchChallenge } from './fetchChallenge'

export async function getDecryptedPassword(
  masterPassword: string,
  id: string
): Promise<string> {
  const challenge = await fetchChallenge('password')

  const encryptedMaster = encrypt(masterPassword, challenge)

  const decrypted = await fetch(
    `${import.meta.env.VITE_API_HOST}/passwords/password/decrypt/${id}`,
    {
      method: 'POST',
      body: JSON.stringify({ master: encryptedMaster }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
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
