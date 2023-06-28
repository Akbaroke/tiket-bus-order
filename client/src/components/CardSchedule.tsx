import { Timeline } from '@mantine/core'
import { BiTimeFive } from 'react-icons/bi'
import { IoTicketOutline } from 'react-icons/io5'
import { MdEventSeat, MdHotelClass } from 'react-icons/md'
import {
  formatDate,
  formatTime,
} from '../utils/timeManipulation'
import { Schedules } from '../contexts/swr-context'
import useIsTimestampPassed from '../hooks/useCurrentDate'
import rupiahFormat from '../utils/rupiahFormat'
import clsx from 'clsx'

export default function CardSchedule({
  data,
}: {
  data: Schedules
}) {
  const hasPassed = useIsTimestampPassed(Number(data.date))

  return (
    <div className="w-[250px] h-max shadow-md hover:shadow-lg transition-shadow p-[15px] rounded-[5px] relative overflow-hidden flex flex-col justify-between cursor-pointer gap-2">
      <div className="flex flex-col">
        <h1 className="text-[18px] text-[#262626] font-medium leading-none">
          {data.name_bus_fleet}
        </h1>
        <p className="text-[#9F9F9F] text-[14px]">{data.code}</p>
      </div>
      <div className="relative mb-1">
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
                  {data.name_station_from}
                </p>
                <p className="text-[#9F9F9F] text-[12px] truncate mt-1 capitalize">
                  {data.city_station_from}
                </p>
              </div>
            }></Timeline.Item>
          <Timeline.Item
            bullet={<span></span>}
            title={
              <div className="w-[150px] overflow-hidden relative -left-3">
                <p className="text-[#262626] text-[14px] truncate capitalize">
                  {data.name_station_to}
                </p>
                <p className="text-[#9F9F9F] text-[12px] truncate mt-1 capitalize">
                  {data.name_city_to}
                </p>
              </div>
            }></Timeline.Item>
        </Timeline>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <div className="text-[#FF7200] flex gap-1 items-center justify-start">
            <MdHotelClass className="text-[14px]" />
            <p className="text-[12px] capitalize">
              {data.className}
            </p>
          </div>
          <div className="text-[#095BA8] flex gap-1 items-center justify-start -mt-[2px]">
            <MdEventSeat className="text-[14px]" />
            <p className="text-[12px] capitalize">
              {data.seatingCapacity} Seats
            </p>
          </div>
        </div>
        <div className="flex items-end gap-[1px]">
          <h1 className="text-[#FF7200] font-semibold text-[15px]">
            {rupiahFormat(Number(data.price))}
          </h1>
          <p className="text-[#9F9F9F] text-[13px]">/seat</p>
        </div>
      </div>
      <IoTicketOutline className="absolute block w-[250px] h-[250px] -top-[15px] -right-[15px] -z-10 text-[#095BA8]/5" />
      <div
        className={clsx(
          ' rounded-br-[5px] rounded-bl-[5px] w-[52px] h-[54px] text-[#095BA8] flex flex-col justify-center items-center absolute top-0 right-4',
          hasPassed ? 'bg-[#d4d4d4]' : 'bg-[#FFDD00]'
        )}>
        <BiTimeFive className="text-[18px] -mb-[2px]" />
        <h1 className="text-[14px] font-semibold">
          {formatTime(Number(data.date))}
        </h1>
        <p className="text-[9px] font-medium -mt-[2px]">
          {formatDate(Number(data.date))}
        </p>
      </div>
    </div>
  )
}
