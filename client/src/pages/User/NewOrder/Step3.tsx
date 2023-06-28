import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StateOrder } from '../../../redux/reducers/order'
import axios from '../../../api'
import { Schedules } from '../../../contexts/swr-context'
import { HiUser } from 'react-icons/hi2'
import { TbAirConditioning } from 'react-icons/tb'
import {
  MdAirlineSeatReclineExtra,
  MdEventSeat,
  MdVideoLibrary,
} from 'react-icons/md'
import { FaChargingStation } from 'react-icons/fa'
import { Timeline } from '@mantine/core'
import useIsTimestampPassed from '../../../hooks/useCurrentDate'
import {
  formatDate,
  formatTime,
} from '../../../utils/timeManipulation'
import { BiTimeFive } from 'react-icons/bi'
import clsx from 'clsx'
import rupiahFormat from '../../../utils/rupiahFormat'
import Button from '../../../components/Button'
import { resetSeat } from '../../../redux/actions/seat'

type Props = {
  nextStep: () => void
  prevStep: () => void
}
interface State {
  order: StateOrder
}
export default function Step3({ nextStep, prevStep }: Props) {
  const dispatch = useDispatch()
  const { schedulIdSelected } = useSelector(
    (state: State) => state.order
  )
  const [schedule, setSchedule] = React.useState<Schedules>()
  const hasPassed = useIsTimestampPassed(Number(schedule?.date))

  React.useEffect(() => {
    const getDetailSchedule = async () => {
      const { data } = await axios.get(
        `/schedule/getById/${schedulIdSelected}`
      )
      setSchedule(data.data)
    }
    getDetailSchedule()
    dispatch(resetSeat())
  }, [dispatch, schedulIdSelected])

  return (
    <div>
      <h1 className="text-center text-[#095BA8] text-[22px] font-semibold block w-max pb-2 px-10 border-b border-b-[#095BA8]/20 capitalize m-auto mb-5">
        Detail schedule
      </h1>
      <div className="flex flex-col gap-5">
        <div className="w-full rounded-[10px] shadow-lg p-5 flex flex-col gap-4 overflow-hidden relative pb-14">
          <div>
            <h1 className="font-semibold text-[18px] text-[#262626]">
              {schedule?.name_bus_fleet}
            </h1>
            <h2 className="text-[16px] font-medium text-[#9F9F9F]">
              {schedule?.code}
            </h2>
          </div>
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-col gap-1">
              <ListBusFeatures
                icon={<HiUser />}
                text={`capacity ${schedule?.seatingCapacity} seat`}
              />
              <ListBusFeatures
                icon={
                  <TbAirConditioning className="fill-gray-600" />
                }
                text="Full AC"
              />
              <ListBusFeatures
                icon={
                  <MdVideoLibrary className="fill-gray-600" />
                }
                text="entertainment"
              />
            </div>
            <div className="flex flex-col gap-1">
              <ListBusFeatures
                icon={<MdEventSeat />}
                text={`Seat format ${schedule?.format}`}
              />
              <ListBusFeatures
                icon={<MdAirlineSeatReclineExtra />}
                text="seat adjustment"
              />
              <ListBusFeatures
                icon={<FaChargingStation />}
                text="Charging Station"
              />
            </div>
          </div>
          <div className="bg-green-300/30 absolute bottom-0 left-0 right-0 p-2 pl-5">
            <div className="flex items-center gap-2 text-gray-700 [&>svg]:text-[14px]">
              <MdEventSeat />
              <p className="text-[13px] capitalize font-semibold">
                You can choose a seat on the next page.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full rounded-[10px] shadow-lg p-5 flex flex-col gap-4 overflow-hidden relative">
          <div className="flex justify-between items-center ">
            <h2 className="text-[16px] font-medium text-[#9F9F9F]">
              Travel Route
            </h2>
            <div
              className={clsx(
                ' rounded-br-[5px] rounded-bl-[5px] w-[52px] h-[54px] text-[#095BA8] flex flex-col justify-center items-center absolute top-0 right-5',
                hasPassed ? 'bg-[#d4d4d4]' : 'bg-[#FFDD00]'
              )}>
              <BiTimeFive className="text-[18px] -mb-[2px]" />
              <h1 className="text-[14px] font-semibold">
                {formatTime(Number(schedule?.date) | 0)}
              </h1>
              <p className="text-[9px] font-medium -mt-[2px]">
                {formatDate(Number(schedule?.date) | 0)}
              </p>
            </div>
          </div>
          <div className="relative">
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
                    <p className="text-[#9F9F9F] text-[12px] truncate mt-1 capitalize">
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
                    <p className="text-[#9F9F9F] text-[12px] truncate mt-1 capitalize">
                      {schedule?.name_city_to}
                    </p>
                  </div>
                }></Timeline.Item>
            </Timeline>
          </div>
        </div>
        <div className="w-full rounded-[10px] shadow-lg p-5 flex flex-col gap-4 overflow-hidden relative">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-semibold text-[18px] text-[#262626]">
              Price
            </h1>
            <div className="flex items-end gap-[1px]">
              <h1 className="text-[#FF7200] font-semibold text-[18px]">
                {rupiahFormat(Number(schedule?.price) || 0)}
              </h1>
              <p className="text-[#9F9F9F] text-[13px]">/seat</p>
            </div>
          </div>
          {!hasPassed ? (
            <Button className="bg-[#095BA8]" onClick={nextStep}>
              Continue
            </Button>
          ) : (
            <Button className="bg-gray-400" onClick={prevStep}>
              Sorry you can't order, Back
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

type PropsListFeatur = {
  icon: React.ReactElement
  text: string
}

const ListBusFeatures = ({ icon, text }: PropsListFeatur) => (
  <div className="flex items-center gap-2 text-gray-700 [&>svg]:text-[14px]">
    {icon}
    <p className="text-[13px] capitalize">{text}</p>
  </div>
)
