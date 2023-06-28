import { FormValues } from '../../pages/User/NewOrder/Step1'
import ActionType from '../actionType'

export interface DataPayload extends FormValues {
  schedulIdSelected?: string
}

type Action = {
  type: string
  payload: DataPayload
}

interface FormOrder {
  name: string
  contact: string
  seats: number
}
export interface StateOrder {
  formSearch: FormValues
  schedulIdSelected: string
  formOrder: FormOrder[]
}

const initialState: StateOrder = {
  formSearch: {
    from: '',
    to: '',
    date: '',
    seatCount: 0,
  },
  schedulIdSelected: '',
  formOrder: [],
}

const reducerOrder = (
  state = initialState,
  action: Action
): StateOrder => {
  switch (action.type) {
    case ActionType.SET_FORM_SEARCH:
      return {
        ...state,
        formSearch: {
          from: action.payload.from,
          to: action.payload.to,
          date: action.payload.date,
          seatCount: action.payload.seatCount,
        },
      }
    case ActionType.RESET_FORM_SEARCH:
      return {
        ...state,
        formSearch: initialState.formSearch,
      }
    case ActionType.SET_SCHEDULE_SELECTED:
      return {
        ...state,
        schedulIdSelected: action.payload
          .schedulIdSelected as string,
      }
    default:
      return state
  }
}

export default reducerOrder
