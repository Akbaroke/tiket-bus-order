import ActionType from '../actionType'

export interface UserInfo {
  email: string
  role: 'admin' | 'user'
  encrypt: string
}

type UserAction = {
  type: string
  payload: UserInfo
}

const initialState = {
  email: '',
  role: '',
}

const reducerUser = (
  state = initialState,
  action: UserAction
) => {
  // const { email, role, encrypt } = action.payload
  switch (action.type) {
    case ActionType.SET_USER:
      if (action.payload.encrypt) {
        localStorage.setItem(
          'token',
          action.payload.encrypt
        )
      }
      return {
        email: action.payload.email,
        role: action.payload.role,
      }
    case ActionType.RESET_USER:
      return initialState
    default:
      return state
  }
}

export default reducerUser
