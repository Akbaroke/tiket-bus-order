import { Orders, Schedules } from '../contexts/swr-context'

const scheduleById = (
  scheduleId: string,
  schedules?: Schedules[]
): Schedules | undefined => {
  return schedules?.filter(
    item => item.scheduleId === scheduleId
  )[0]
}

const ordersById = (
  orderId: string,
  orders?: Orders[]
): Orders | undefined => {
  return orders?.filter(item => item.orderId === orderId)[0]
}


const ordersByCode = (code: string, orders?: Orders[]) => {
  return orders?.filter(item => item.data[0].code === code)[0]
}

export { scheduleById, ordersById, ordersByCode }
