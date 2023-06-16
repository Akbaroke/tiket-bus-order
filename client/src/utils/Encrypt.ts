import crypto from 'crypto-js'
import { env } from '../vite-env'

const Encrypt = (data, userEmail: string): string => {
  const key = (userEmail + env.SALT) as string
  return crypto.AES.encrypt(
    JSON.stringify(data),
    key
  ).toString()
}

export default Encrypt
