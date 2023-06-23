import * as React from 'react'
import { useForm } from '@mantine/form'
import { Button, Group, Select } from '@mantine/core'
import axios from '../../../api'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { useSelector } from 'react-redux'
import { UserInfo } from '../../../redux/reducers/user'
import { useSWRConfig } from 'swr'
import {
  Armadas,
  Buses,
  Classes,
  useSWRContext,
} from '../../../contexts/swr-context'
import DeleteBus from './DeleteBus'

type Props = {
  type: 'add' | 'edit'
  busId?: string
  onClose: () => void
}

interface FormValues {
  busFleetId: string
  classId: string
}

interface State {
  user: UserInfo
}

function FormBus({ type, busId, onClose }: Props) {
  const swrContext = useSWRContext()
  const armadas: Armadas[] | undefined = swrContext?.armadas
  const classes: Classes[] | undefined = swrContext?.classes
  const buses: Buses[] | undefined = swrContext?.buses

  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = React.useState(false)
  const { encrypt } = useSelector((state: State) => state.user)
  const [codeBus, setCodeBus] = React.useState('')

  React.useEffect(() => {
    if (type === 'edit' && busId) {
      getBusById(busId)
    }
    const bus = buses?.find(obj => obj.id === busId)
    if (bus) {
      setCodeBus(bus.code)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, busId])

  const getBusById = async (busId: string): Promise<void> => {
    const { data } = await axios.get(`/bus/getById/${busId}`)
    const { busFleetId, id_class } = data.data
    form.setValues({
      busFleetId,
      classId: id_class,
    })
    console.log(data)
  }

  const handleEdit = async (
    value: FormValues
  ): Promise<void> => {
    notifyLoading('Send data...', 'edit-bus')
    setIsLoading(true)

    try {
      await axios.post(`/bus/update/${busId}`, {
        busFleetId: value.busFleetId,
        classId: value.classId,
        encrypt: encrypt,
      })

      mutate('/bus')
      mutate('/armada')
      notifySuccess('Edit bus successful!', 'edit-bus')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Edit bus failed!', 'edit-bus')
    }
    setIsLoading(false)
  }

  const handleAdd = async (value: FormValues): Promise<void> => {
    notifyLoading('Send data...', 'add-bus')
    setIsLoading(true)

    try {
      await axios.post('/bus/create', {
        busFleetId: value.busFleetId,
        classId: value.classId,
        encrypt: encrypt,
      })
      mutate('/bus')
      mutate('/armada')
      notifySuccess('Add bus successful!', 'add-bus')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Add bus failed!', 'add-bus')
    }
    setIsLoading(false)
  }

  const form = useForm<FormValues>({
    initialValues: {
      busFleetId: '',
      classId: '',
    },

    validate: {
      busFleetId: value => {
        if (!value) {
          return 'Invalid Armada'
        }
        return null
      },
      classId: value => {
        if (!value) {
          return 'Invalid Class'
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
        <Select
          withAsterisk
          searchable
          clearable
          allowDeselect
          dropdownPosition="bottom"
          label="Armada Name"
          placeholder="-pick one-"
          data={
            armadas?.map(obj => ({
              value: obj.busFleetId,
              label: obj.name,
            })) || []
          }
          error={form.errors.busFleetId}
          {...form.getInputProps('busFleetId')}
        />
        <Select
          withAsterisk
          searchable
          clearable
          allowDeselect
          dropdownPosition="bottom"
          label="Class Name"
          placeholder="-pick one-"
          data={
            classes?.map(obj => ({
              value: obj.classId,
              label: obj.className,
            })) || []
          }
          error={form.errors.classId}
          {...form.getInputProps('classId')}
        />
      </div>

      <Group position="right" mt="xl">
        {busId && type === 'edit' ? (
          <DeleteBus busId={busId} name={codeBus} />
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

export default FormBus
