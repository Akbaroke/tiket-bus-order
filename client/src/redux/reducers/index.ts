import { combineReducers } from '@reduxjs/toolkit'
import reducerUser from './user'
import reducerOrder from './order'
import reducerSeat from './seat'

const rootReducer = combineReducers({
  user: reducerUser,
  order: reducerOrder,
  seat: reducerSeat,
})

export default rootReducer
