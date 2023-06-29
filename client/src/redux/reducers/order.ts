import { FormValues } from '../../pages/User/NewOrder/Step1'
import ActionType from '../actionType'

export interface FormSearch extends FormValues {
  schedulIdSelected?: string
}

interface Payload extends FormSearch, FormOrder {}

type Action = {
  type: string
  payload: Payload
}

export interface FormOrder {
  passenger: number
  name: string
  contact: string
  isValid: boolean
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
    case ActionType.SET_FORM_ORDER:
      return {
        ...state,
        formOrder: [
          ...state.formOrder.filter(
            order => order.passenger !== action.payload.passenger
          ),
          {
            passenger: action.payload.passenger,
            name: action.payload.name,
            contact: action.payload.contact,
            isValid: action.payload.isValid,
          },
        ],
      }
    case ActionType.RESET_FORM_ORDER:
      return {
        ...state,
        formOrder: initialState.formOrder,
      }
    default:
      return state
  }
}

export default reducerOrder
