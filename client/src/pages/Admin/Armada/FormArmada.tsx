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
import { UserInfo } from '../../../redux/reducers/user'
import { useSWRConfig } from 'swr'

type Props = {
  type: 'add' | 'edit'
  armadaId?: string
  onClose: () => void
}

interface FormValues {
  armadaName: string
}

interface State {
  user: UserInfo
}

function FormArmada({ type, armadaId, onClose }: Props) {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = React.useState(false)
  const { encrypt } = useSelector(
    (state: State) => state.user
  )
  React.useEffect(() => {
    if (type === 'edit' && armadaId) {
      getArmadaById(armadaId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, armadaId])

  const getArmadaById = async (
    armadaId: string
  ): Promise<void> => {
    const { data } = await axios.get(
      `/busFleet/getById/${armadaId}`
    )
    const { name } = data.data
    form.setValues({
      armadaName: name,
    })
    console.log({
      armadaName: name,
      armadaId,
    })
  }

  const handleAdd = async (value: FormValues): Promise<void> => {
    notifyLoading('Send data...', 'add-armada')
    setIsLoading(true)

    try {
      await axios.post('/busFleet/create', {
        name: value.armadaName,
        encrypt: encrypt,
      })
      mutate('/armada')
      mutate('/bus')
      mutate('/schedule')
      notifySuccess('Add armada successful!', 'add-armada')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Add armada failed!', 'add-armada')
    }
    setIsLoading(false)
  }

  const handleEdit = async (
    value: FormValues
  ): Promise<void> => {
    notifyLoading('Send data...', 'edit-armada')
    setIsLoading(true)

    try {
      await axios.post(`/busFleet/update/${armadaId}`, {
        name: value.armadaName,
        encrypt: encrypt,
      })

      mutate('/armada')
      mutate('/bus')
      mutate('/schedule')
      notifySuccess('Edit armada successful!', 'edit-armada')
      onClose()
    } catch (error) {
      console.log(error)
      notifyError('Edit armada failed!', 'edit-armada')
    }
    setIsLoading(false)
  }

  const form = useForm<FormValues>({
    initialValues: {
      armadaName: '',
    },

    validate: {
      armadaName: value => {
        if (!/^[a-zA-Z0-9 ]{3,30}$/.test(value)) {
          return 'Invalid Armada Name'
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
          label="Armada Name"
          placeholder="name"
          error={form.errors.armadaName}
          {...form.getInputProps('armadaName')}
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

export default FormArmada
