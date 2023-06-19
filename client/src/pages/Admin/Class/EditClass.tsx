import * as React from 'react'
import InputLabel from '../../../components/InputLabel'
import { HiOutlineHashtag } from 'react-icons/hi'
import {
  MdAirlineSeatReclineExtra,
  MdReduceCapacity,
} from 'react-icons/md'
import Button from '../../../components/Button'
import { env } from '../../../vite-env.d'
import axios from '../../../api'
import { useSelector } from 'react-redux'
import { UserInfo } from '../../../redux/reducers/user'
import SelectOption from '../../../components/SelectOption'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { useNavigate, useParams } from 'react-router-dom'

interface State {
  user: UserInfo
}

type Form = {
  name: string
  capacity: string
  format: string
}

type Params = {
  id: string
}

const formatSeat = [
  { value: '1-3', label: '1-3' },
  { value: '2-2', label: '2-2' },
  { value: '3-1', label: '3-1' },
]

export default function EditClass() {
  const [form, setForm] = React.useState<Form>({
    name: '',
    capacity: '',
    format: '',
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
      ? getClassById(params.id)
      : navigate('/admin/class')
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

  const handleOptionChange = (value: string) => {
    setForm(prevForm => ({
      ...prevForm,
      format: value,
    }))
  }

  const getClassById = async (
    classId: string
  ): Promise<void> => {
    const { data } = await axios.get(
      `${env.VITE_APP_URL}/classes/getById/${classId}`
    )
    setForm({
      name: data.data.className,
      format: data.data.format,
      capacity: data.data.seatingCapacity,
    })
  }

  const handleSubmit = async (
    e: React.SyntheticEvent
  ): Promise<void> => {
    e.preventDefault()
    notifyLoading('Send data...', 'addclass')
    setIsLoading(true)

    try {
      await axios.post(
        `${env.VITE_APP_URL}/classes/create`,
        {
          className: form.name,
          seatingCapacity: form.capacity,
          format: form.format,
          encrypt: encrypt,
        }
      )
      notifySuccess('Add new class successful!', 'addclass')
      navigate('/admin/class')
    } catch (error) {
      console.log(error)
      notifyError('Add new class failed!', 'addclass')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h1 className="text-center font-semibold text-[20px] mb-6">
          Edit Class
        </h1>
        <form
          className="flex flex-col gap-5 items-center w-full"
          onSubmit={handleSubmit}>
          <InputLabel
            icon={<HiOutlineHashtag />}
            label="name class"
            value={form.name}
            onChange={handleOnChange}
            autoFocus
            required
          />
          <InputLabel
            icon={<MdReduceCapacity />}
            label="capacity"
            type="number"
            min={20}
            max={100}
            value={form.capacity}
            onChange={handleOnChange}
            required
          />
          <SelectOption
            icon={<MdAirlineSeatReclineExtra />}
            label="format seat"
            options={formatSeat}
            selectedValue={form.format}
            onChange={handleOptionChange}
          />
          <Button
            className="h-[60px] w-full mt-2"
            type="submit"
            isLoading={isLoading}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
