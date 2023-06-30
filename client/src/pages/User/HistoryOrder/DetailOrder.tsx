import * as React from 'react'
import { useParams } from 'react-router-dom'
import {
  formatDateText,
  formatTime,
} from '../../../utils/timeManipulation'
import rupiahFormat from '../../../utils/rupiahFormat'
import {
  AiFillCheckCircle,
  AiFillInfoCircle,
} from 'react-icons/ai'
import clsx from 'clsx'
import { Badge, Timeline } from '@mantine/core'
import { BiTimeFive } from 'react-icons/bi'
import useIsTimestampPassed from '../../../hooks/useCurrentDate'
import {
  ordersById,
  scheduleById,
} from '../../../utils/getDataFromSwr'
import {
  Orders,
  Schedules,
  useSWRContext,
} from '../../../contexts/swr-context'
import {
  MdAirlineSeatReclineExtra,
  MdHotelClass,
} from 'react-icons/md'
import { TbBus, TbBusStop } from 'react-icons/tb'
import { QRCodeSVG } from 'qrcode.react'
import useCountdownTimer from '../../../hooks/useCountdownTimer'

export default function DetailOrder() {
  const { id } = useParams()
  const swrContext = useSWRContext()
  const schedules: Schedules[] | undefined =
    swrContext?.schedules
  const orders: Orders[] | undefined = swrContext?.orders

  const [order, setOrder] = React.useState<Orders>()
  const [schedule, setSchedule] = React.useState<Schedules>()
  const [expiredTime, setExpiredTime] = React.useState<number>(0)
  const countDown = useCountdownTimer(expiredTime)

  const hasPassed = useIsTimestampPassed(
    Number(scheduleById(order?.scheduleId || '', schedules)) || 0
  )

  React.useEffect(() => {
    if (id) {
      setOrder(ordersById(id, orders))
      setSchedule(
        scheduleById(order?.scheduleId || '', schedules)
      )
      setExpiredTime(order?.expiredAt || 0)
    }
  }, [
    id,
    schedules,
    orders,
    order?.scheduleId,
    order?.expiredAt,
  ])

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="w-full p-5 rounded-[10px] bg-white shadow-md relative mt-5">
        <div className="flex justify-center items-center flex-col absolute -top-5 left-1/2 transform -translate-x-1/2 gap-2">
          <div
            className={clsx(
              'rounded-full w-max p-2',
              order?.isPaid === 1
                ? 'bg-green-600 '
                : 'bg-yellow-400 '
            )}>
            {order?.isPaid === 1 ? (
              <AiFillCheckCircle className="text-white text-[25px]" />
            ) : (
              <AiFillInfoCircle className="text-white text-[25px]" />
            )}
          </div>
          <h1 className="font-semibold text-[#262626] text-[15px]">
            Order {order?.isPaid === 1 ? 'Success' : 'Pending'}
          </h1>
        </div>
        <div className="flex justify-between [&>ul]:flex [&>ul]:flex-col [&>ul]:gap-3 mt-10">
          <ul className="text-sm text-gray-500">
            <li>Purchased</li>
            <li>Payment Method</li>
            <li>Total Price</li>
          </ul>
          <ul className="text-sm text-[#262626] text-end">
            <li>{formatDateText(order?.createdAt || 0)}</li>
            <li>Cash (COD)</li>
            <li className="font-semibold">
              {rupiahFormat(order?.totalPrice || 0)}
            </li>
          </ul>
        </div>
      </div>
      {order?.isPaid !== 1 ? (
        <div className="p-5 rounded-[10px] bg-white shadow-md text-center flex flex-col gap-2">
          <h1 className="uppercase font-semibold text-[#095BA8]">
            make payment in time
          </h1>
          <h2 className="text-xl font-bold">{countDown}</h2>
          <i className="text-sm text-gray-500">
            (Before {formatDateText(order?.expiredAt || 0)},{' '}
            {formatTime(order?.expiredAt || 0)})
          </i>
        </div>
      ) : null}
      <div className="mt-2">
        <h1 className="font-semibold text-[#262626] text-[14px] ml-2">
          E-Tiket Bus
        </h1>
        <div className="w-full rounded-sm bg-white shadow-md mt-2 relative">
          <span className="block w-10 h-10 rounded-full bg-[#F4F7FE] absolute -top-5 left-1/2 transform -translate-x-1/2 "></span>
          <div className="p-5 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Kode Booking
              </p>
              <h2 className="text-xl font-bold text-[#095BA8]">
                {order?.data[0].code}
              </h2>
            </div>
            <QRCodeSVG
              value={order?.data[0].code || ''}
              className="w-[50px] h-max m-0"
            />
          </div>
          <div className="p-5 border-t border-dashed">
            <div className="flex gap-2 items-center mb-2 drop-shadow-md">
              <MdHotelClass className="text-[40px] text-[#FF7200]" />
              <div>
                <h1 className="font-semibold text-lg text-[#262626]">
                  {schedule?.name_bus_fleet} {schedule?.code}
                </h1>
                <p className="text-sm text-gray-500 capitalize">
                  {schedule?.className} - {order?.seatCount}{' '}
                  Seats
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <Timeline
                active={hasPassed ? 1 : 0}
                mt="sm"
                bulletSize={10}
                lineWidth={2}>
                <Timeline.Item
                  lineVariant="dashed"
                  className="-mb-2"
                  bullet={<span></span>}
                  title={
                    <div className="w-[150px] overflow-hidden relative -left-3">
                      <p className="text-[#262626] text-[14px] truncate capitalize">
                        {schedule?.name_station_from}
                      </p>
                      <p className="text-[#9F9F9F] text-[12px] truncate mt-1 capitalize flex items-center gap-1">
                        <TbBus className="text-[14px]" />
                        {schedule?.city_station_from}
                      </p>
                    </div>
                  }></Timeline.Item>
                <Timeline.Item
                  bullet={<span></span>}
                  title={
                    <div className="w-[150px] overflow-hidden relative -left-3">
                      <p className="text-[#262626] text-[14px] truncate capitalize">
                        {schedule?.name_station_to}
                      </p>
                      <p className="text-[#9F9F9F] text-[12px] truncate mt-1 capitalize flex items-center gap-1">
                        <TbBusStop className="text-[14px]" />
                        {schedule?.name_city_to}
                      </p>
                    </div>
                  }></Timeline.Item>
              </Timeline>
              <div className="text-right">
                <div className="inline-flex gap-1 items-center text-sm text-gray-500">
                  <BiTimeFive />
                  <p>
                    {formatTime(Number(schedule?.time || 0))}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDateText(Number(schedule?.date || 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-3 border-t border-dashed">
            <h1 className="font-semibold text-sm">Passengers</h1>
            {order?.data
              .slice()
              .reverse()
              .map((data, index) => (
                <div key={index} className="flex gap-2 text-sm">
                  <p className="font-medium text-[#262626]">
                    {index + 1}.
                  </p>
                  <div className="flex justify-between w-full">
                    <div>
                      <h1 className="font-medium text-[#262626]">
                        {data.customer}
                      </h1>
                      <p className="capitalize text-gray-500 text-[13px]">
                        TLP - {data.contact}
                      </p>
                      <div className="capitalize text-gray-500 flex gap-1 items-center text-[13px]">
                        <MdAirlineSeatReclineExtra />
                        <p>
                          {schedule?.className} {schedule?.code}{' '}
                          / Seat {data.seat}
                        </p>
                      </div>
                    </div>
                    <Badge
                      color="gray"
                      radius="sm"
                      className="font-semibold capitalize">
                      Dewasa
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
