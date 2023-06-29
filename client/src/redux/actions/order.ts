import ActionType from '../actionType'
import { FormOrder, FormSearch } from '../reducers/order'

export const setFormSearch = ({
  from,
  to,
  date,
  seatCount,
}: FormSearch) => ({
  type: ActionType.SET_FORM_SEARCH,
  payload: {
    from,
    to,
    date,
    seatCount,
  },
})

export const resetFormSearch = () => ({
  type: ActionType.RESET_FORM_SEARCH,
})

export const setScheduleSelected = ({
  schedulIdSelected,
}: {
  schedulIdSelected: string
}) => ({
  type: ActionType.SET_SCHEDULE_SELECTED,
  payload: { schedulIdSelected },
})

export const resetScheduleSelected = () => ({
  type: ActionType.RESET_SCHEDULE_SELECTED,
})

export const setFormOrder = ({
  passenger,
  name,
  contact,
  isValid,
}: FormOrder) => ({
  type: ActionType.SET_FORM_ORDER,
  payload: {
    passenger,
    name,
    contact,
    isValid,
  },
})

export const resetFormOrder = () => ({
  type: ActionType.RESET_FORM_ORDER,
})
