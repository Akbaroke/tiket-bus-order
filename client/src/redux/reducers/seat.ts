import ActionType from '../actionType'

export interface DataSeat {
  passenger: number
  seat: number
}

interface Action {
  type: string
  payload: DataSeat
}

export interface StateSeat {
  dataSeats: DataSeat[]
}

const initialState: StateSeat = {
  dataSeats: [],
}

const reducerSeat = (
  state: StateSeat = initialState,
  action: Action
): StateSeat => {
  switch (action.type) {
    case ActionType.SET_SEAT:
      return {
        ...state,
        dataSeats: [
          ...state.dataSeats.filter(
            seat => seat.passenger !== action.payload.passenger
          ),
          {
            passenger: action.payload.passenger,
            seat: action.payload.seat,
          },
        ],
      }
    case ActionType.RESET_SEAT:
      return initialState
    default:
      return state
  }
}

export default reducerSeat
