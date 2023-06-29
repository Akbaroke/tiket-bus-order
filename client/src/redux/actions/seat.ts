import ActionType from '../actionType'
import { DataSeat } from '../reducers/seat'

export const setSeat = ({ passenger, seat }: DataSeat) => ({
  type: ActionType.SET_SEAT,
  payload: { passenger, seat },
})
export const resetSeat = () => ({
  type: ActionType.RESET_SEAT,
})
