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

      <div className="rounded-[10px] shadow-md p-5">
        <div className="flex gap-2 items-end mb-3">
          <h1 className="text-[15px] font-semibold capitalize text-[#262626]">
            {schedule?.name_bus_fleet}
          </h1>
          <p className="text-gray-400 uppercase text-[14px]">
            • {schedule?.className}
          </p>
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
                  Ticket {i + 1}
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

      <div className="w-full rounded-[10px] shadow-md p-5 flex flex-wrap gap-4 overflow-x-auto relative pb-14">
        <SeatMap schedule={schedule} passenger={passenger} />
      </div>
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
  const { dataSeats } = useSelector((state: State) => state.seat)
  const seatOnBook = [1, 3, 5, 7]

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
      <GiSteeringWheel className="text-[24px] text-gray-400" />
      <div className="flex justify-end">
        <div className="flex flex-wrap gap-2 justify-end">
          {seatsFirstHalf.map(seatNumber => (
            <SeatsPotition
              number={seatNumber}
              key={seatNumber}
              passenger={passenger}
              isSeatOnBook={seatOnBook.includes(seatNumber)}
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
              isSeatOnBook={seatOnBook.includes(seatNumber)}
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
          ? 'bg-gray-600/20 border border-gray-bg-gray-600 text-gray-bg-gray-600'
          : isSeatOtherPassenger
          ? 'bg-[#095BA8]/20 border border-[#095BA8] text-[#095BA8]'
          : isMySeat
          ? 'bg-[#095BA8]/20 border border-[#095BA8] text-[#095BA8]'
          : 'border text-gray-400 cursor-pointer transition-all hover:shadow-lg'
      )}>
      {isSeatOnBook ? (
        <RxCross1 className="text-gray-800/20" />
      ) : (
        number
      )}
    </div>
  )
}
