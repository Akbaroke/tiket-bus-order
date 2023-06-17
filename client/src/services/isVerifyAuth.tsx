// import { env } from '../vite-env.d'
// import axios from '../api'

// async function isVerifyAuth(
//   email: string,
//   to_stores: string | null
// ): Promise<boolean> {
//   if (to_stores === null) return false

//   const { data } = await axios.post(
//     `${env.VITE_APP_URL}/auth/decrypt`,
//     {
//       encrypt: to_stores,
//     }
//   )

//   if (data.data.email !== email) return false

//   return true
// }

// export default isVerifyAuth
