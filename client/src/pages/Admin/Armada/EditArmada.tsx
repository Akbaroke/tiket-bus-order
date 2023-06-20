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
import { useNavigate, useParams } from 'react-router-dom'
import ButtonModal from '../../../components/ButtonModal'

interface State {
  user: UserInfo
}

type Form = {
  name: string
}

type Params = {
  id: string
}

export default function EditArmada() {
  const [form, setForm] = React.useState<Form>({
    name: '',
  })
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false)
  const { encrypt } = useSelector(
    (state: State) => state.user
  )
  const navigate = useNavigate()
  const params = useParams<Params>()

  React.useEffect(() => {
    params.id
      ? getArmadaById(params.id)
      : navigate('/admin/armada')
  }, [navigate, params.id])

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target
    setForm(prevForm => ({
      ...prevForm,
      [id]: value,
    }))
  }

  const getArmadaById = async (
    armadaId: string
  ): Promise<void> => {
    console.log(armadaId)
    const { data } = await axios.get(
      `${env.VITE_APP_URL}/busFleet/getById/${armadaId}`
    )

    setForm({
      name: data.data.name,
    })
  }

  const handleSubmit = async (
    e: React.SyntheticEvent
  ): Promise<void> => {
    e.preventDefault()
    notifyLoading('Send data...', 'editarmada')
    setIsLoading(true)

    try {
      const { data } = await axios.post(
        `${env.VITE_APP_URL}/busFleet/update/${params.id}`,
        {
          name: form.name,
          encrypt: encrypt,
        }
      )
      console.log(data)

      notifySuccess('Edit armada successful!', 'editarmada')
      navigate('/admin/armada')
    } catch (error) {
      console.log(error)
      notifyError('Edit armada failed!', 'editarmada')
    }
    setIsLoading(false)
  }

  const handleDeleteArmada = async () => {
    notifyLoading('Delete processing...', 'deletearmada')
    try {
      const { data } = await axios.post(
        `${env.VITE_APP_URL}/busFleet/delete/${params.id}`,
        {
          encrypt: encrypt,
        }
      )
      console.log(data)
      notifySuccess(
        'Delete armada successful!',
        'deletearmada'
      )
      navigate('/admin/armada')
    } catch (error) {
      console.log(error)
      notifyError('Delete armada failed!', 'deletearmada')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h1 className="text-center font-semibold text-[20px] mb-6">
          Edit Armada
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
          <div className="flex flex-row-reverse justify-between gap-4 w-full">
            <Button
              className="h-[50px] w-full"
              type="submit"
              isLoading={isLoading}>
              Update
            </Button>
            <ButtonModal
              className="h-[50px] w-full bg-white border border-red-500 text-red-500"
              type="button"
              isLoading={isLoading}
              text="Delete"
              title="Delete Armada"
              cancelButtonText="No, Cancel"
              modalButtonText="Yes, Delete"
              modalButtonAction={handleDeleteArmada}>
              <p className="text-sm">
                You will remove the "<b>{form.name}</b>"
                armada. Are you sure ?
              </p>
            </ButtonModal>
          </div>
        </form>
      </div>
    </div>
  )
}
