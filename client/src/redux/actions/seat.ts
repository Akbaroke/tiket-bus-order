import ActionType from '../actionType'
import { SeatPayload } from '../reducers/seat'

export const setSeat = ({ passenger, seat }: SeatPayload) => ({
  type: ActionType.SET_SEAT,
  payload: { passenger, seat },
})
export const resetSeat = () => ({
  type: ActionType.RESET_SEAT,
})
