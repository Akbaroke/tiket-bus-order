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

interface State {
  user: UserInfo
}

const initialForm = {
  name: '',
  capacity: '',
  format: '2-2',
}

const formatSeat = [
  { value: '1-3', label: '1-3' },
  { value: '2-2', label: '2-2' },
  { value: '3-1', label: '3-1' },
]

export default function AddClass() {
  const [form, setForm] = React.useState(initialForm)
  const { encrypt } = useSelector(
    (state: State) => state.user
  )

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

  const handleSubmit = async (
    e: React.SyntheticEvent
  ): Promise<void> => {
    e.preventDefault()
    const { data } = await axios.post(
      `${env.VITE_APP_URL}/classes/create`,
      {
        className: form.name,
        seatingCapacity: form.capacity,
        format: form.format,
        encrypt: encrypt,
      }
    )
    console.log(data)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h1 className="text-center font-semibold text-[20px] mb-6">
          Add New Class
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
            type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
