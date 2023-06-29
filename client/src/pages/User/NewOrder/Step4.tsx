import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StateOrder } from '../../../redux/reducers/order'
import { StateSeat } from '../../../redux/reducers/seat'
import { Schedules } from '../../../contexts/swr-context'
import clsx from 'clsx'
import axios from '../../../api'
import { setSeat } from '../../../redux/actions/seat'
import { RxCross1 } from 'react-icons/rx'
import { GiSteeringWheel } from 'react-icons/gi'
import { BsDot, BsFillBusFrontFill } from 'react-icons/bs'
import {
  formatDate,
  formatTime,
} from '../../../utils/timeManipulation'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { Button } from '@mantine/core'
import { resetFormOrder } from '../../../redux/actions/order'

interface State {
  order: StateOrder
  seat: StateSeat
}

type Props = {
  nextStep: () => void
}

export default function Step4({ nextStep }: Props) {
  const { formSearch, schedulIdSelected } = useSelector(
    (state: State) => state.order
  )
  const { dataSeats } = useSelector((state: State) => state.seat)
  const [passenger, setPassenger] = React.useState<number>(1)
  const [schedule, setSchedule] = React.useState<Schedules>()

  React.useEffect(() => {
    const getDetailSchedule = async () => {
      const { data } = await axios.get(
        `/schedule/getById/${schedulIdSelected}`
      )
      setSchedule(data.data)
    }
    getDetailSchedule()
  }, [schedulIdSelected])

  return (
    <div>
      <h1 className="text-center text-[#095BA8] text-[22px] font-semibold block w-max pb-2 px-10 border-b border-b-[#095BA8]/20 capitalize m-auto mb-5">
        Select seat
      </h1>

      <div className="rounded-[10px] shadow-md p-5 bg-white">
        <div className="mb-4 flex justify-between gap-1">
          <div className="flex gap-1 items-center">
            <BsFillBusFrontFill className="text-[14px] text-[#095BA8] mr-2" />
            <h1 className="text-[15px] font-semibold capitalize text-[#262626]">
              {schedule?.name_bus_fleet}
            </h1>
            <BsDot className="text-gray-400" />
            <p className="text-gray-400 uppercase text-[14px]">
              {schedule?.className}
            </p>
          </div>
          <div className="flex text-[#262626] font-medium items-center text-sm">
            <p>{formatDate(Number(schedule?.date) || 0)}</p>
            <BsDot className="text-gray-400" />
            <p>{formatTime(Number(schedule?.time) || 0)}</p>
            <AiOutlineClockCircle className="text-[16px] text-[#095BA8] ml-2" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 sm:justify-start justify-center w-full max-w-[100%] overflow-auto">
          {Array(formSearch.seatCount)
            .fill(0)
            .map((_, i) => (
              <div
                className={clsx(
                  'w-[150px] rounded-md py-3 pl-4 pr-10 capitalize cursor-pointer flex-shrink-0',
                  passenger === i + 1
                    ? 'bg-[#095BA8]/20 border border-[#095BA8] text-[#095BA8]'
                    : 'border text-[#262626]'
                )}
                key={i}
                onClick={() => setPassenger(i + 1)}>
                <p className="text capitalize font-semibold text-[14px]">
                  Passenger {i + 1}
                </p>
                <p className="text capitalize text-[12px]">
                  seat{' '}
                  {dataSeats
                    .filter(s => s.passenger === i + 1)
                    .map(s => s.seat)}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className="w-full rounded-[10px] shadow-md p-5 flex flex-col gap-8 overflow-x-auto relative pb-14 bg-white mt-4">
        <div className="flex flex-wrap items-center justify-center gap-8 border-b border-b-gray-200 py-5 max-w-[350px] m-auto text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-[5px] bg-[#095BA8]/20 border border-[#095BA8]"></span>
            <p>Selected</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-[5px] border border-gray-400"></span>
            <p>Available</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-[5px] bg-gray-600/20 border border-gray-600/20"></span>
            <p>Not Available</p>
          </div>
        </div>
        <SeatMap schedule={schedule} passenger={passenger} />
      </div>

      {dataSeats.length === formSearch.seatCount ? (
        <Button
          className="bg-[#095BA8] w-full mt-5"
          onClick={nextStep}>
          Continue
        </Button>
      ) : (
        <Button className="bg-gray-400 w-full mt-5" disabled>
          Continue
        </Button>
      )}
    </div>
  )
}

const SeatMap = ({
  schedule,
  passenger,
}: {
  schedule?: Schedules
  passenger: number
}) => {
  const dispatch = useDispatch()
  const { dataSeats } = useSelector((state: State) => state.seat)
  const [seatOnBook, setseatOnBook] = React.useState<
    Array<string>
  >([])

  React.useEffect(() => {
    const getCheckSeats = async () => {
      const { data } = await axios.get(
        `/order/checkSeats/${schedule?.scheduleId}`
      )
      if (data.status === 200) {
        setseatOnBook(data.data.seatNotEmpty)
      }
    }
    getCheckSeats()
    dispatch(resetFormOrder())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule])

  const seatCount = Number(schedule?.seatingCapacity) || 0
  const format: number = schedule?.format === '2-2' ? 2 : 3
  const halfSeatCount = Math.ceil(seatCount / format)

  const seatsFirstHalf = Array(halfSeatCount)
    .fill(0)
    .map((_, i) => i + 1)

  const seatsSecondHalf = Array(seatCount - halfSeatCount)
    .fill(0)
    .map((_, i) => i + halfSeatCount + 1)

  return (
    <div className="w-[180px] flex flex-col items-end gap-5 m-auto">
      <GiSteeringWheel className="text-[24px] text-gray-400 hover:rotate-[360deg] transition-all" />
      <div className="flex justify-end">
        <div className="flex flex-wrap gap-2 justify-end">
          {seatsFirstHalf.map(seatNumber => (
            <SeatsPotition
              number={seatNumber}
              key={seatNumber}
              passenger={passenger}
              isSeatOnBook={seatOnBook.includes(
                seatNumber.toString()
              )}
              isSeatOtherPassenger={dataSeats.some(
                seat =>
                  seat.passenger !== passenger &&
                  seat.seat === seatNumber
              )}
              isMySeat={dataSeats.some(
                seat =>
                  seat.passenger === passenger &&
                  seat.seat === seatNumber
              )}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {seatsSecondHalf.map(seatNumber => (
            <SeatsPotition
              number={seatNumber}
              key={seatNumber}
              passenger={passenger}
              isSeatOnBook={seatOnBook.includes(
                seatNumber.toString()
              )}
              isSeatOtherPassenger={dataSeats.some(
                seat =>
                  seat.passenger !== passenger &&
                  seat.seat === seatNumber
              )}
              isMySeat={dataSeats.some(
                seat =>
                  seat.passenger === passenger &&
                  seat.seat === seatNumber
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const SeatsPotition = ({
  number,
  passenger,
  isSeatOnBook,
  isSeatOtherPassenger,
  isMySeat,
}: {
  number: number
  passenger: number
  isSeatOnBook: boolean
  isSeatOtherPassenger: boolean
  isMySeat: boolean
}) => {
  const dispatch = useDispatch()

  return (
    <div
      onClick={() => {
        isSeatOnBook
          ? null
          : isSeatOtherPassenger
          ? null
          : isMySeat
          ? null
          : dispatch(
              setSeat({ passenger: passenger, seat: number })
            )
      }}
      className={clsx(
        'w-[25px] h-[25px] rounded-[5px] text-xs font-semibold grid place-items-center',
        isSeatOnBook
          ? 'bg-gray-600/20 border border-gray-600/20 text-gray-800/40'
          : isSeatOtherPassenger
          ? 'bg-[#095BA8]/20 border border-[#095BA8] text-[#095BA8]'
          : isMySeat
          ? 'bg-[#095BA8]/20 border border-[#095BA8] text-[#095BA8]'
          : 'border border-gray-400/50 text-gray-400 cursor-pointer transition-all hover:shadow-lg'
      )}>
      {isSeatOnBook ? <RxCross1 /> : number}
    </div>
  )
}
