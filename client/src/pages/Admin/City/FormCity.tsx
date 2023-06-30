import * as React from 'react'
import { useForm } from '@mantine/form'
import { Button, Group, TextInput } from '@mantine/core'
import axios from '../../../api'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { useSelector } from 'react-redux'
import { useSWRConfig } from 'swr'
import { DataUser } from '../../../interfaces/store'

type Props = {
  type: 'add' | 'edit'
  cityId?: string
  onClose: () => void
}

interface FormValues {
  cityName: string
}

interface State {
  user: DataUser
}

function FormCity({ type, cityId, onClose }: Props) {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = React.useState(false)
  const { encrypt } = useSelector((state: State) => state.user)
  React.useEffect(() => {
    if (type === 'edit' && cityId) {
      getClassById(cityId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, cityId])

  const getClassById = async (cityId: string): Promise<void> => {
    const { data } = await axios.get(`/cities/getById/${cityId}`)
    const { name } = data.data
    form.setValues({
      cityName: name,
    })
  }

  const handleAdd = async (value: FormValues): Promise<void> => {
    notifyLoading('Send data...', 'add-city')
    setIsLoading(true)

    try {
      await axios.post('/cities/create', {
        name: value.cityName,
        encrypt: encrypt,
      })
      mutate('/city')
      mutate('/station')
      mutate('/schedule')
      notifySuccess('Add city successful!', 'add-city')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Add city failed!', 'add-city')
    }
    setIsLoading(false)
  }

  const handleEdit = async (
    value: FormValues
  ): Promise<void> => {
    notifyLoading('Send data...', 'edit-city')
    setIsLoading(true)

    try {
      await axios.post(`/cities/update/${cityId}`, {
        name: value.cityName,
        encrypt: encrypt,
      })

      mutate('/city')
      mutate('/station')
      mutate('/schedule')
      notifySuccess('Edit city successful!', 'edit-city')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Edit city failed!', 'edit-city')
    }
    setIsLoading(false)
  }

  const form = useForm<FormValues>({
    initialValues: {
      cityName: '',
    },

    validate: {
      cityName: value => {
        if (!/^[a-zA-Z0-9 ]{3,30}$/.test(value)) {
          return 'Invalid City Name'
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
          label="City Name"
          placeholder="Jakata"
          error={form.errors.cityName}
          {...form.getInputProps('cityName')}
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

export default FormCity
