import ActionType from '../actionType'
import { UserInfo } from '../reducers/user'

export const setUser = ({
  email,
  role,
  encrypt,
}: UserInfo) => ({
  type: ActionType.SET_USER,
  payload: { email, role, encrypt },
})

export const resetUser = () => ({
  type: ActionType.RESET_USER,
})
