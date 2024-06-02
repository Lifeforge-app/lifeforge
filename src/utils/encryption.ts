import CryptoJS from 'crypto-js'

export const encrypt = (text: string, key: string): string => {
  return CryptoJS.AES.encrypt(text, key).toString()
}

export const decrypt = (text: string, key: string): string => {
  return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8)
}
