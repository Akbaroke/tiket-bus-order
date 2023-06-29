import * as React from 'react'
import { StateOrder } from '../../../redux/reducers/order'
import { StateSeat } from '../../../redux/reducers/seat'
import { useSelector } from 'react-redux'
import { Schedules } from '../../../contexts/swr-context'
import axios from '../../../api'
import { Badge, Button, Tooltip } from '@mantine/core'
import {
  formatDate,
  formatTime,
} from '../../../utils/timeManipulation'
import { BsDot, BsFillBusFrontFill } from 'react-icons/bs'
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'
import { IoIosArrowDown } from 'react-icons/io'
import { MdAirlineSeatReclineExtra } from 'react-icons/md'
import FormPassenger from './FormPassenger'
import { Disclosure, Transition } from '@headlessui/react'
import clsx from 'clsx'
import rupiahFormat from '../../../utils/rupiahFormat'
import useIsTimestampPassed from '../../../hooks/useCurrentDate'
import mergeDataOrder from '../../../utils/mergeDataOrder'
import { useSWRConfig } from 'swr'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { DataUser } from '../../../interfaces/store'

interface State {
  order: StateOrder
  seat: StateSeat
  user: DataUser
}

type Props = {
  prevStep: () => void
}

export default function Step5({ prevStep }: Props) {
  const { encrypt } = useSelector((state: State) => state.user)
  const { formSearch, schedulIdSelected, formOrder } =
    useSelector((state: State) => state.order)
  const { dataSeats } = useSelector((state: State) => state.seat)
  const [schedule, setSchedule] = React.useState<Schedules>()
  const hasPassed = useIsTimestampPassed(Number(schedule?.date))
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = React.useState(false)

  const isValidData = (): boolean => {
    if (
      formSearch.seatCount === dataSeats.length &&
      formOrder.every(data => data.isValid)
    ) {
      return true
    } else {
      return false
    }
  }

  const handleSubmitOrder = async () => {
    notifyLoading('Send data...', 'new-order')
    setIsLoading(true)
    const { name, contact, seats } = mergeDataOrder(
      formOrder,
      dataSeats
    )

    try {
      const { data } = await axios.post('/order/create', {
        scheduleId: schedule?.scheduleId,
        customers: name,
        contact: contact,
        seats: seats,
        encrypt: encrypt,
      })
      console.log(data)
      mutate('/schedule')
      notifySuccess('Order successful!', 'new-order')
    } catch (error) {
      console.log(error)
      notifyError('Order failed!', 'new-order')
    }
    setIsLoading(false)
  }

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
      <div className="rounded-[10px] shadow-md p-5 flex flex-col gap-2 bg-white">
        <div className="flex text-[#262626] font-medium items-center text-[12px]">
          <Badge radius="sm" mr={8}>
            GO
          </Badge>
          <p>{formatDate(Number(schedule?.date) || 0)}</p>
          <BsDot className="text-gray-400" />
          <p>{formatTime(Number(schedule?.time) || 0)}</p>
        </div>
        <div className="flex gap-2 text-[#262626] font-semibold items-center text-[14px]">
          <p>{schedule?.city_station_from}</p>
          <HiOutlineArrowNarrowRight className="relative top-[2px]" />
          <p>{schedule?.name_city_to}</p>
        </div>
        <div className="flex text-[#262626] font-medium items-center text-[12px] gap-1">
          <BsFillBusFrontFill className="text-[12px] text-[#095BA8] mr-1" />
          <p className="capitalize">
            {schedule?.name_bus_fleet} • {schedule?.className}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-6">
        <h1 className="font-semibold text-[#262626] ml-1">
          Passenger Details
        </h1>
        {dataSeats.map(s => (
          <Disclosure
            className="rounded-[10px] shadow-md p-5 pt-4 flex flex-col gap-2 bg-white mb-2"
            key={s.passenger}
            defaultOpen={true}
            as="div">
            {({ open }) => (
              <>
                <Disclosure.Button>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[14px] text-[#095BA8]/80 font-semibold">
                      <h1>Passenger {s.passenger}</h1>
                      <IoIosArrowDown
                        className={clsx(
                          open
                            ? 'rotate-180 transform transition-all'
                            : ''
                        )}
                      />
                    </div>
                    <div className="bg-[#F4F7FE] rounded-xl p-3 flex gap-1 items-center">
                      <MdAirlineSeatReclineExtra className="text-[#262626] mx-2" />
                      <div className="flex flex-col items-start justify-center">
                        <p className="text-[11px] text-gray-500">
                          {schedule?.name_bus_fleet}
                        </p>
                        <p className="text-[12px] font-semibold text-[#262626]">
                          Seat {s.seat}
                        </p>
                      </div>
                    </div>
                  </div>
                </Disclosure.Button>
                <Transition
                  enter="transition duration-300 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-300 opacity-300"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-300 opacity-300"
                  leaveTo="transform scale-95 opacity-0">
                  <Disclosure.Panel
                    className="text-gray-500"
                    as="div">
                    <FormPassenger
                      isOpen={open}
                      passenger={s.passenger}
                    />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
      <div className="w-full rounded-[10px] mt-3 shadow-md p-5 flex flex-col gap-4 overflow-hidden relative bg-white">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-semibold text-[18px] text-[#262626]">
            Total Price
          </h1>
          <h1 className="text-[#FF7200] font-semibold text-[18px]">
            {rupiahFormat(
              (Number(schedule?.price) || 0) *
                formSearch.seatCount
            )}
          </h1>
        </div>
        {!hasPassed ? (
          (schedule?.remainingSeatCapacity || 0) >=
          formSearch.seatCount ? (
            isValidData() ? (
              <Button
                className="bg-[#095BA8]"
                onClick={handleSubmitOrder}
                loading={isLoading}>
                Submit Order
              </Button>
            ) : (
              <Tooltip label="Please complete the passenger data form!!">
                <Button
                  sx={{
                    '&[data-disabled]': { pointerEvents: 'all' },
                  }}
                  className="bg-gray-400 hover:bg-gray-400">
                  Continue
                </Button>
              </Tooltip>
            )
          ) : (
            <Tooltip label="Sorry the seats are full!!">
              <Button
                sx={{
                  '&[data-disabled]': { pointerEvents: 'all' },
                }}
                className="bg-gray-400 hover:bg-gray-400"
                onClick={() => {
                  prevStep()
                  prevStep()
                  prevStep()
                }}>
                Find another bus ?
              </Button>
            </Tooltip>
          )
        ) : (
          <Tooltip label="Sorry the bus has left!!">
            <Button
              sx={{
                '&[data-disabled]': { pointerEvents: 'all' },
              }}
              className="bg-gray-400 hover:bg-gray-400"
              onClick={() => {
                prevStep()
                prevStep()
                prevStep()
              }}>
              Find another bus ?
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
