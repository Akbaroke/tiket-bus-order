import crypto from 'crypto-js'
import { env } from '../vite-env.d'
import axios from '../api'
import { DataUser } from '../interfaces/store'

const Decrypt = (encrypt: string) => {
  return JSON.parse(
    crypto.AES.decrypt(encrypt, env.VITE_APP_SALT).toString(
      crypto.enc.Utf8
    )
  )
}

const DecryptFromServer = async (
  encrypt: string
): Promise<DataUser> => {
  const { data } = await axios.post(
    `${env.VITE_APP_URL}/auth/decrypt`,
    {
      encrypt: encrypt,
    }
  )
  return data.data
}

export { Decrypt, DecryptFromServer }
