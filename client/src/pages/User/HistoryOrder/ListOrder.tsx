import * as React from 'react'
import axios from '../../../api'
import { useSelector } from 'react-redux'
import { DataUser } from '../../../interfaces/store'
import {
  formatDate,
  formatTime,
} from '../../../utils/timeManipulation'

interface State {
  user: DataUser
}

interface Histories {
  code: string
  contact: string
  customer: string
  expired_at: number
  isPaid: boolean
  orderId: string
  scheduleId: string
  seat: number
  updated_at: number
  created_at: number
}

export default function ListOrder() {
  const { userId } = useSelector((state: State) => state.user)
  const [histories, setHistories] = React.useState<Histories[]>(
    []
  )

  React.useEffect(() => {
    const getHistory = async () => {
      const { data } = await axios.get(
        `/order/getByUserId/${userId}`
      )
      setHistories(data.data)
      console.log(data.data)
    }
    if (userId) {
      getHistory()
    }
  }, [userId])

  return (
    <div>
      <h1 className="text-center text-[#095BA8] text-[22px] font-semibold block w-max pb-2 px-10 border-b border-b-[#095BA8]/20 capitalize m-auto mb-5 mt-5">
        Order History
      </h1>
      <div>
        {histories?.map(history => (
          <div
            key={history.orderId}
            className="rounded-[10px] shadow-md p-5 flex flex-col gap-4 bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <p>{formatDate(history?.created_at || 0)}</p>-
              <p>{formatTime(history?.created_at || 0)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
