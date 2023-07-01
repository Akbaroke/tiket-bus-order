import * as React from 'react'
import { useForm } from '@mantine/form'
import { Button, Group, Select, TextInput } from '@mantine/core'
import axios from '../../../api'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { useSelector } from 'react-redux'
import { useSWRConfig } from 'swr'
import {
  Cities,
  useSWRContext,
} from '../../../contexts/swr-context'
import { DataUser } from '../../../interfaces/store'

type Props = {
  type: 'add' | 'edit'
  stationId?: string
  onClose: () => void
}

interface FormValues {
  stationName: string
  cityId: string
}

interface State {
  user: DataUser
}

function FormStation({ type, stationId, onClose }: Props) {
  const swrContext = useSWRContext()
  const cities: Cities[] | undefined = swrContext?.cities

  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = React.useState(false)
  const { encrypt } = useSelector((state: State) => state.user)

  React.useEffect(() => {
    if (type === 'edit' && stationId) {
      getStationById(stationId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, stationId])

  const getStationById = async (
    stationId: string
  ): Promise<void> => {
    const { data } = await axios.get(
      `/station/getById/${stationId}`
    )
    const { name, id_city } = data.data
    form.setValues({
      stationName: name,
      cityId: id_city,
    })
  }

  const handleEdit = async (
    value: FormValues
  ): Promise<void> => {
    notifyLoading('Send data...', 'edit-station')
    setIsLoading(true)

    try {
      await axios.post(`/station/update/${stationId}`, {
        name: value.stationName,
        cityId: value.cityId,
        encrypt: encrypt,
      })

      mutate('/city')
      mutate('/station')
      mutate('/schedule')
      notifySuccess('Edit station successful!', 'edit-station')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Edit station failed!', 'edit-station')
    }
    setIsLoading(false)
  }

  const handleAdd = async (value: FormValues): Promise<void> => {
    notifyLoading('Send data...', 'add-station')
    setIsLoading(true)

    try {
      await axios.post('/station/create', {
        name: value.stationName,
        cityId: value.cityId,
        encrypt: encrypt,
      })
      mutate('/city')
      mutate('/station')
      mutate('/schedule')
      notifySuccess('Add station successful!', 'add-station')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Add station failed!', 'add-station')
    }
    setIsLoading(false)
  }

  const form = useForm<FormValues>({
    initialValues: {
      stationName: '',
      cityId: '',
    },

    validate: {
      stationName: value => {
        if (!/^[a-zA-Z0-9 ]{3,30}$/.test(value)) {
          return 'Invalid Station Name'
        }
        return null
      },
      cityId: value => {
        if (!value) {
          return 'Invalid City'
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
        <TextInput
          withAsterisk
          label="Station Name"
          placeholder="Name"
          error={form.errors.stationName}
          {...form.getInputProps('stationName')}
        />
        <Select
          withAsterisk
          searchable
          clearable
          allowDeselect
          dropdownPosition="bottom"
          label="Station Name"
          placeholder="-pick one-"
          data={
            cities?.map(obj => ({
              value: obj.cityId,
              label: obj.name,
            })) || []
          }
          error={form.errors.cityId}
          {...form.getInputProps('cityId')}
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

export default FormStation
