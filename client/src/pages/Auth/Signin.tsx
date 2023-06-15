import * as React from 'react'
import { BiLockAlt } from 'react-icons/bi'
import Button from '../../components/Button'
import InputAuth from '../../components/InputAuth'
import { HiOutlineMail } from 'react-icons/hi'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../components/Toast'
import axios from '../../api'
import { FormValues } from './Auth.d'
import { env } from '../../vite-env.d'
import { useNavigate } from 'react-router-dom'

const initialForm = {
  email: '',
  password: '',
}

function Signin(): JSX.Element {
  const [form, setForm] =
    React.useState<FormValues>(initialForm)
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false)

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

  const handleOnSubmit = async (
    e: React.SyntheticEvent
  ) => {
    e.preventDefault()
    setIsLoading(true)
    notifyLoading('Signin verify...', 'signin')

    try {
      const { data } = await axios.post(
        `${env.VITE_APP_URL}/auth/login`,
        {
          email: form.email,
          password: form.password,
        }
      )
      switch (data.status) {
        case 200:
          console.log(data)
          notifySuccess('Signin successful!', 'signin')
          break
        default:
          console.log(data);
          
          notifyError(
            `Signin failed! ${data?.message} `,
            'signin'
          )
          break
      }
    } catch (error) {
      notifyError('Signin failed!', 'signin')
    }

    setIsLoading(false)
    setForm(initialForm)
    navigate('/home')
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleOnSubmit}>
      <InputAuth
        icon={<HiOutlineMail />}
        label="email Address"
        type="email"
        autoFocus
        required
        value={form.email}
        onChange={handleOnChange}
      />
      <InputAuth
        icon={<BiLockAlt />}
        label="password"
        type="password"
        minLength={8}
        required
        value={form.password}
        onChange={handleOnChange}
      />
      <Button
        type="submit"
        text="Continue"
        className="h-[60px]"
        disabled={isLoading}
      />
    </form>
  )
}

export default Signin
