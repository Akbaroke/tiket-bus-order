import * as React from 'react'
import { useForm } from '@mantine/form'
import {
  Button,
  Group,
  NumberInput,
  Select,
} from '@mantine/core'
import axios from '../../../api'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { useSelector } from 'react-redux'
import { useSWRConfig } from 'swr'
import {
  Buses,
  Stations,
  useSWRContext,
} from '../../../contexts/swr-context'
import { DateInput, TimeInput } from '@mantine/dates'
import { AiOutlineClockCircle } from 'react-icons/ai'
import {
  combineDateTimeToEpochMillis,
  formatTime,
} from '../../../utils/timeManipulation'
import DeleteSchedule from './DeleteSchedule'
import { DataUser } from '../../../interfaces/store'

type Props = {
  type: 'add' | 'edit'
  scheduleId?: string
  onClose: () => void
}

interface FormValues {
  date: string | Date
  time: string
  from: string
  to: string
  busId: string
  price: number
}

interface State {
  user: DataUser
}

function FormSchedule({ type, scheduleId, onClose }: Props) {
  const swrContext = useSWRContext()
  const stations: Stations[] | undefined = swrContext?.stations
  const buses: Buses[] | undefined = swrContext?.buses

  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = React.useState(false)
  const { encrypt } = useSelector((state: State) => state.user)

  React.useEffect(() => {
    if (type === 'edit' && scheduleId) {
      getStationById(scheduleId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, scheduleId])

  const getStationById = async (
    scheduleId: string
  ): Promise<void> => {
    const { data } = await axios.get(
      `/schedule/getById/${scheduleId}`
    )
    const {
      date,
      time,
      station_from,
      station_to,
      busId,
      price,
    } = data.data
    form.setValues({
      date: new Date(Number(date) * 1000),
      time: formatTime(Number(time)),
      from: station_from,
      to: station_to,
      busId: busId,
      price: Number(price),
    })
  }

  const handleEdit = async (
    value: FormValues
  ): Promise<void> => {
    notifyLoading('Send data...', 'edit-schedule')
    setIsLoading(true)

    const dateTime = combineDateTimeToEpochMillis(
      value.date as string,
      value.time
    )
    try {
      await axios.post(`/schedule/update/${scheduleId}`, {
        date: dateTime,
        time: dateTime,
        from: value.from,
        to: value.to,
        busId: value.busId,
        price: Number(value.price),
        encrypt: encrypt,
      })

      mutate('/schedule')
      notifySuccess('Edit station successful!', 'edit-schedule')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Edit station failed!', 'edit-schedule')
    }
    setIsLoading(false)
  }

  const handleAdd = async (value: FormValues): Promise<void> => {
    notifyLoading('Send data...', 'add-schedule')
    setIsLoading(true)

    const dateTime = combineDateTimeToEpochMillis(
      value.date as string,
      value.time
    )
    try {
      await axios.post('/schedule/create', {
        date: dateTime,
        time: dateTime,
        from: value.from,
        to: value.to,
        busId: value.busId,
        price: Number(value.price),
        encrypt: encrypt,
      })
      mutate('/schedule')
      notifySuccess('Add station successful!', 'add-schedule')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Add station failed!', 'add-schedule')
    }
    setIsLoading(false)
  }

  const form = useForm<FormValues>({
    initialValues: {
      date: '',
      time: '',
      from: '',
      to: '',
      busId: '',
      price: 0,
    },

    validate: {
      date: value => {
        if (!value) {
          return 'Invalid Date'
        }
        return null
      },
      time: value => {
        if (!value) {
          return 'Invalid Time'
        }
        return null
      },
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
      busId: value => {
        if (!value) {
          return 'Invalid Bus'
        }
        return null
      },
      price: value => {
        if (value === 0) {
          return 'Invalid Bus'
        }
        return null
      },
    },
  })

  return (
    <form
      onSubmit={form.onSubmit(values => {
        type === 'edit' ? handleEdit(values) : handleAdd(values)
      })}>
      <div className="flex flex-col gap-2">
        <DateInput
          withAsterisk
          minDate={new Date()}
          valueFormat="DD/MM/YYYY"
          label="Date"
          placeholder="-pick date-"
          error={form.errors.date}
          {...form.getInputProps('date')}
        />
        <TimeInput
          withAsterisk
          label="Time"
          icon={<AiOutlineClockCircle />}
          error={form.errors.time}
          {...form.getInputProps('time')}
        />
        <Select
          withAsterisk
          searchable
          clearable
          allowDeselect
          dropdownPosition="bottom"
          label="From"
          placeholder="-pick one-"
          data={
            stations?.map(obj => ({
              value: obj.stationId,
              label: `${obj.name} (${obj.city})`,
            })) || []
          }
          error={form.errors.from}
          {...form.getInputProps('from')}
        />
        <Select
          withAsterisk
          searchable
          clearable
          allowDeselect
          dropdownPosition="bottom"
          label="To"
          placeholder="-pick one-"
          data={
            stations?.map(obj => ({
              value: obj.stationId,
              label: `${obj.name} (${obj.city})`,
            })) || []
          }
          error={form.errors.to}
          {...form.getInputProps('to')}
        />
        <Select
          withAsterisk
          searchable
          clearable
          allowDeselect
          dropdownPosition="bottom"
          label="Bus"
          placeholder="-pick one-"
          data={
            buses?.map(obj => ({
              value: obj.id,
              label: `${obj.code} (${obj.armada})`,
            })) || []
          }
          error={form.errors.busId}
          {...form.getInputProps('busId')}
        />
        <NumberInput
          withAsterisk
          label="Price"
          placeholder="0"
          max={1_000_000_000}
          min={10_000}
          step={1_000}
          error={form.errors.price}
          {...form.getInputProps('price')}
        />
      </div>

      <Group position="right" mt="xl">
        {scheduleId && type === 'edit' ? (
          <DeleteSchedule
            scheduleId={scheduleId}
            name={'this'}
          />
        ) : null}
        <Button
          type="submit"
          className="bg-[#095BA8]"
          loading={isLoading}>
          Save
        </Button>
      </Group>
    </form>
  )
}

export default FormSchedule
