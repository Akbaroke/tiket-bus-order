import * as React from 'react'
import InputLabel from '../../../components/InputLabel'
import { HiOutlineHashtag } from 'react-icons/hi'
import Button from '../../../components/Button'
import { env } from '../../../vite-env.d'
import axios from '../../../api'
import { useSelector } from 'react-redux'
import { UserInfo } from '../../../redux/reducers/user'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { useNavigate } from 'react-router-dom'

interface State {
  user: UserInfo
}

type Form = {
  name: string
}

const initialForm = {
  name: '',
}

export default function AddArmada() {
  const [form, setForm] = React.useState<Form>(initialForm)
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false)
  const { encrypt } = useSelector(
    (state: State) => state.user
  )
  const navigate = useNavigate()

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target
    setForm(prevForm => ({
      ...prevForm,
      [id]: value,
    }))
  }

  const handleSubmit = async (
    e: React.SyntheticEvent
  ): Promise<void> => {
    e.preventDefault()
    notifyLoading('Send data...', 'addarmada')
    setIsLoading(true)

    try {
      await axios.post(
        `${env.VITE_APP_URL}/busFleet/create`,
        {
          name: form.name,
          encrypt: encrypt,
        }
      )
      notifySuccess(
        'Add new armada successful!',
        'addarmada'
      )
      setForm(initialForm)
      navigate('/admin/armada')
    } catch (error) {
      console.log(error)
      notifyError('Add new armada failed!', 'addarmada')
    }

    setIsLoading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h1 className="text-center font-semibold text-[20px] mb-6">
          Add New Armada
        </h1>
        <form
          className="flex flex-col gap-5 items-center w-full"
          onSubmit={handleSubmit}>
          <InputLabel
            icon={<HiOutlineHashtag />}
            label="name armada"
            value={form.name}
            onChange={handleOnChange}
            autoFocus
            required
          />
          <Button
            className="h-[60px] w-full mt-2"
            type="submit"
            isLoading={isLoading}>
            Save
          </Button>
        </form>
      </div>
    </div>
  )
}
