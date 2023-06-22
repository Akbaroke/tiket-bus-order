import * as React from 'react'
import { useForm } from '@mantine/form'
import {
  Button,
  Group,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core'
import axios from '../../../api'
import { env } from '../../../vite-env.d'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { useSelector } from 'react-redux'
import { UserInfo } from '../../../redux/reducers/user'
import { useSWRConfig } from 'swr'

type Props = {
  type: 'add' | 'edit'
  classId?: string
  onClose: () => void
}

interface FormValues {
  className: string
  formatSeat: string
  seatCapacity: number | null
}

interface State {
  user: UserInfo
}

function FormClass({ type, classId, onClose }: Props) {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = React.useState(false)
  const { encrypt } = useSelector(
    (state: State) => state.user
  )
  React.useEffect(() => {
    if (type === 'edit' && classId) {
      getClassById(classId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, classId])

  const getClassById = async (
    classId: string
  ): Promise<void> => {
    const { data } = await axios.get(
      `${env.VITE_APP_URL}/classes/getById/${classId}`
    )
    const { className, format, seatingCapacity } = data.data
    form.setValues({
      className,
      formatSeat: format,
      seatCapacity: parseInt(seatingCapacity),
    })
    console.log({
      className,
      formatSeat: format,
      seatCapacity: seatingCapacity.toString(),
    })
  }

  const handleAdd = async (
    value: FormValues
  ): Promise<void> => {
    notifyLoading('Send data...', 'addclass')
    setIsLoading(true)

    try {
      await axios.post('/classes/create', {
        className: value.className,
        seatingCapacity: value.seatCapacity,
        format: value.formatSeat,
        encrypt: encrypt,
      })
      mutate('/classes')
      notifySuccess('Add class successful!', 'addclass')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Add class failed!', 'addclass')
    }
    setIsLoading(false)
  }

  const handleEdit = async (
    value: FormValues
  ): Promise<void> => {
    notifyLoading('Send data...', 'editclass')
    setIsLoading(true)

    try {
      await axios.post(`/classes/update/${classId}`, {
        className: value.className,
        seatingCapacity: value.seatCapacity,
        format: value.formatSeat,
        encrypt: encrypt,
      })

      mutate('/classes')
      notifySuccess('Edit class successful!', 'editclass')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Edit class failed!', 'editclass')
    }
    setIsLoading(false)
  }

  const form = useForm<FormValues>({
    initialValues: {
      className: '',
      formatSeat: '',
      seatCapacity: 0,
    },

    validate: {
      className: value => {
        if (!/^[a-zA-Z0-9 ]{3,30}$/.test(value)) {
          return 'Invalid className'
        }
        return null
      },
      formatSeat: value => {
        if (!value || value.length !== 3) {
          return 'Format Seat must be 3 characters long'
        }
        return null
      },
      seatCapacity: value => {
        if (value === 0) {
          return 'Invalid seatCapacity'
        }
        return null
      },
    },
  })

  return (
    <form
      onSubmit={form.onSubmit(values => {
        type === 'edit'
          ? handleEdit(values)
          : handleAdd(values)
      })}>
      <div className="flex flex-col gap-2">
        <TextInput
          withAsterisk
          label="Class Name"
          placeholder="VIP"
          error={form.errors.className}
          {...form.getInputProps('className')}
        />
        <Select
          withAsterisk
          label="Format Seat"
          placeholder="-pick one-"
          data={[
            { value: '1-3', label: '1-3' },
            { value: '2-2', label: '2-2' },
            { value: '3-1', label: '3-1' },
          ]}
          error={form.errors.formatSeat}
          {...form.getInputProps('formatSeat')}
        />
        <NumberInput
          withAsterisk
          label="Seat Capacity"
          placeholder="20"
          max={100}
          min={20}
          error={form.errors.seatCapacity}
          {...form.getInputProps('seatCapacity')}
        />
      </div>

      <Group position="right" mt="xl">
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

export default FormClass
