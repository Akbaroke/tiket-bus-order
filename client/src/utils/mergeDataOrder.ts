import { FormOrder } from '../redux/reducers/order'
import { DataSeat } from '../redux/reducers/seat'

interface ResultMergeDataOrder {
  name: string[]
  contact: string[]
  seats: number[]
}

function mergeDataOrder(
  formOrder: FormOrder[],
  dataSeats: DataSeat[]
): ResultMergeDataOrder {
  formOrder.sort((a, b) => a.passenger - b.passenger)
  dataSeats.sort((a, b) => a.passenger - b.passenger)

  const result: ResultMergeDataOrder = {
    name: [],
    contact: [],
    seats: [],
  }

  for (let i = 0; i < formOrder.length; i++) {
    const order = formOrder[i]
    const seatData = dataSeats.find(
      data => data.passenger === order.passenger
    )

    if (seatData) {
      result.name.push(order.name)
      result.contact.push(order.contact)
      result.seats.push(seatData.seat)
    }
  }

  return result
}

export default mergeDataOrder
