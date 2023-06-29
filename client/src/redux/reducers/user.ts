import { DataUser } from '../../interfaces/store'
import ActionType from '../actionType'

type UserAction = {
  type: string
  payload: DataUser
}

const initialState: DataUser = {
  userId: '',
  email: '',
  role: 'user',
  encrypt: '',
}

const reducerUser = (
  state = initialState,
  action: UserAction
) => {
  switch (action.type) {
    case ActionType.SET_USER:
      if (action.payload.encrypt) {
        localStorage.setItem('token', action.payload.encrypt)
      }
      return {
        userId: action.payload.userId,
        email: action.payload.email,
        role: action.payload.role,
        encrypt: action.payload.encrypt,
      }
    case ActionType.RESET_USER:
      localStorage.removeItem('token')
      return initialState
    default:
      return state
  }
}

export default reducerUser
