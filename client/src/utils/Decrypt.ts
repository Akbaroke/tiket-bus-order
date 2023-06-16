import crypto from 'crypto-js'
import { env } from '../vite-env'

const Decrypt = (data: string, userEmail: string) => {
  const key = (userEmail + env.SALT) as string
  return JSON.parse(
    crypto.AES.decrypt(data, key).toString(crypto.enc.Utf8)
  )
}

export default Decrypt
