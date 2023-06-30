import * as React from 'react'
import {
  formatDate,
  formatTime,
  isLastWeek,
  isToday,
  isYesterday,
} from '../../../utils/timeManipulation'
import {
  Orders,
  Schedules,
  useSWRContext,
} from '../../../contexts/swr-context'
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'
import { MdDirectionsBus } from 'react-icons/md'
import rupiahFormat from '../../../utils/rupiahFormat'
import { Link } from 'react-router-dom'
import { scheduleById } from '../../../utils/getDataFromSwr'
import useIsTimestampPassed from '../../../hooks/useCurrentDate'
import { useSWRConfig } from 'swr'

export default function ListOrder() {
  const swrContext = useSWRContext()
  const { mutate } = useSWRConfig()
  const orders: Orders[] | undefined = swrContext?.orders

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = today.getTime()

  const sortedOrders =
    orders?.sort((a, b) => b.createdAt - a.createdAt) || []

  const orderByDay: Record<number, typeof sortedOrders> = {}
  sortedOrders.forEach(order => {
    const timestamp = order.createdAt
    const orderDay = new Date(timestamp * 1000.0)
    orderDay.setHours(0, 0, 0, 0)
    const orderDayTimestamp = orderDay.getTime()
    if (!orderByDay[orderDayTimestamp]) {
      orderByDay[orderDayTimestamp] = []
    }
    orderByDay[orderDayTimestamp].push(order)
  })

  React.useEffect(() => {
    mutate('/order')
  }, [mutate])

  return (
    <div>
      <h1 className="text-center text-[#095BA8] text-[22px] font-semibold block w-max pb-2 px-10 border-b border-b-[#095BA8]/20 capitalize mt-5 m-auto">
        Order History
      </h1>

      <div className="pb-14">
        {Object.entries(orderByDay).map(([timestamp, order]) => {
          const orderDay = new Date(Number(timestamp))
          const isTodayResult = isToday(
            todayTimestamp,
            Number(timestamp)
          )
          const isYesterdayResult = isYesterday(
            todayTimestamp,
            Number(timestamp)
          )
          const isLastWeekResult = isLastWeek(
            todayTimestamp,
            Number(timestamp)
          )

          let dateText = ''
          if (isTodayResult) {
            dateText = 'Today'
          } else if (isYesterdayResult) {
            dateText = 'Yesterday'
          } else if (isLastWeekResult) {
            dateText = 'Last Week'
          } else {
            dateText = orderDay.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })
          }

          return (
            <div key={timestamp} className="px-5 py-3">
              <h1 className="font-semibold text-[#262626] text-[14px] mb-2 ml-2">
                {dateText}
              </h1>
              <div className="flex flex-col gap-2">
                {order?.map(data => (
                  <CardListOrder data={data} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CardListOrder = ({ data }: { data: Orders }) => {
  const swrContext = useSWRContext()
  const schedules: Schedules[] | undefined =
    swrContext?.schedules

  const hasPassed = useIsTimestampPassed(data.expiredAt || 0)

  if (!hasPassed) {
    return (
      <Link
        to={`/history/${data.orderId}`}
        key={data?.orderId}
        className="rounded-[7px] shadow-md flex flex-col bg-white">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <p>{formatDate(data?.createdAt || 0)}</p> -
            <p>{formatTime(data?.createdAt || 0)}</p>
          </div>
          <p className="text-sm font-semibold">
            {rupiahFormat(data?.totalPrice)}
          </p>
        </div>
        <div className="flex gap-1 items-center px-4 py-3 bg-gray-100">
          <MdDirectionsBus className="text-[#FA9F08]" />
          <div className="flex gap-2 text-[#262626] font-medium items-center text-[14px]">
            <p>
              {scheduleById(data?.scheduleId, schedules)
                ?.city_station_from || ''}
            </p>
            <HiOutlineArrowNarrowRight className="relative top-[2px]" />
            <p>
              {scheduleById(data?.scheduleId, schedules)
                ?.name_city_to || ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-3">
          {data?.isPaid === 1 ? (
            <p className="text-green-600 font-semibold">
              Order Success
            </p>
          ) : (
            <p className="text-yellow-400 font-semibold">
              Order Pending
            </p>
          )}
        </div>
      </Link>
    )
  } else {
    return null
  }
}
