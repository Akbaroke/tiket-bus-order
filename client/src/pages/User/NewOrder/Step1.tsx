import * as React from 'react'
import { Button, NumberInput, Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import { TbBus, TbBusStop } from 'react-icons/tb'
import {
  Stations,
  useSWRContext,
} from '../../../contexts/swr-context'
import { DateInput } from '@mantine/dates'
import { MdEventSeat, MdOutlineDateRange } from 'react-icons/md'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { dateToEpochMillis } from '../../../utils/timeManipulation'
import axios from '../../../api'

interface FormValues {
  from: string
  to: string
  date: string | Date
  seatCount: number
}

type Props = {
  nextStep: () => void
  // setData: (data: ) => void
}

export default function Step1({ nextStep, setData }: Props) {
  const swrContext = useSWRContext()
  const stations: Stations[] | undefined = swrContext?.stations
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false)

  const handleSubmit = async (
    value: FormValues
  ): Promise<void> => {
    notifyLoading('Send data...', 'search-schedule')
    setIsLoading(true)

    try {
      const { data } = await axios.post(
        '/schedule/getSchedules',
        {
          from: value.from,
          to: value.to,
          date: dateToEpochMillis(value.date as Date),
          seat: value.seatCount,
        }
      )

      if (data.data.length === 0) {
        notifyError('Schedule not available!', 'search-schedule')
      } else {
        notifySuccess(
          'Search schedule successful!',
          'search-schedule'
        )
        nextStep()
        setData(data.data)
      }
    } catch (error) {
      console.log(error)
      notifyError('Search schedule failed!', 'search-schedule')
    }
    setIsLoading(false)
  }

  const form = useForm<FormValues>({
    initialValues: {
      from: '',
      to: '',
      date: '',
      seatCount: 1,
    },

    validate: {
      from: value => {
        if (!value) {
          return 'Invalid From'
        }
        return null
      },
      to: value => {
        if (!value) {
          return 'Invalid To'
        }
        return null
      },
      date: value => {
        if (!value) {
          return 'Invalid Date'
        }
        return null
      },
      seatCount: value => {
        if (value === 0) {
          return 'Invalid Seat Count'
        }
        return null
      },
    },
  })
  return (
    <div className="p-5 shadow-md">
      <h1 className="text-center text-[#095BA8] text-[22px] font-semibold block w-max pb-2 px-10 border-b border-b-[#095BA8]/20 capitalize m-auto mb-5">
        Find bus schedule
      </h1>
      <form
        action=""
        className="flex flex-col gap-3"
        onSubmit={form.onSubmit(values => handleSubmit(values))}>
        <Select
          searchable
          clearable
          allowDeselect
          icon={<TbBus />}
          dropdownPosition="flip"
          placeholder="From"
          data={
            stations?.map(obj => ({
              value: obj.id_city,
              label: `${obj.name} (${obj.city})`,
            })) || []
          }
          error={form.errors.from}
          {...form.getInputProps('from')}
        />
        <Select
          searchable
          clearable
          allowDeselect
          icon={<TbBusStop />}
          dropdownPosition="flip"
          placeholder="To"
          data={
            stations?.map(obj => ({
              value: obj.id_city,
              label: `${obj.name} (${obj.city})`,
            })) || []
          }
          error={form.errors.to}
          {...form.getInputProps('to')}
        />
        <DateInput
          icon={<MdOutlineDateRange />}
          minDate={new Date()}
          valueFormat="DD/MM/YYYY"
          placeholder="-pick date-"
          error={form.errors.date}
          {...form.getInputProps('date')}
        />
        <NumberInput
          placeholder="Count seat"
          icon={<MdEventSeat />}
          min={1}
          max={5}
          error={form.errors.seatCount}
          {...form.getInputProps('seatCount')}
        />
        <Button
          type="submit"
          className="bg-[#095BA8]"
          loading={isLoading}>
          Search
        </Button>
      </form>
    </div>
  )
}
