import { DataUser } from '../../interfaces/store'
import ActionType from '../actionType'

export const setUser = ({
  userId,
  email,
  role,
  encrypt,
}: DataUser) => ({
  type: ActionType.SET_USER,
  payload: { userId, email, role, encrypt },
})

export const resetUser = () => ({
  type: ActionType.RESET_USER,
})
