import CryptoJS from 'crypto-js'

export const encrypt = (text: string, key: string): string => {
  return CryptoJS.AES.encrypt(text, key).toString()
}
