import * as React from 'react'
import { BiLockAlt } from 'react-icons/bi'
import Button from '../../components/Button'
import InputLabel from '../../components/InputLabel'
import { HiOutlineMail } from 'react-icons/hi'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../components/Toast'
import axios from '../../api'
import { FormValues } from './Auth.d'
import { env } from '../../vite-env.d'
import { useDispatch } from 'react-redux/es/exports'
import { setUser } from '../../redux/actions/user'
import AuthLayout from '../../components/Layouts/AuthLayout'

const initialForm = {
  email: '',
  password: '',
}

function Signin(): JSX.Element {
  const dispatch = useDispatch()
  const [form, setForm] =
    React.useState<FormValues>(initialForm)
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false)

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
          dispatch(setUser(data.data))
          notifySuccess('Signin successful!', 'signin')
          setForm(initialForm)
          break
        default:
          console.log(data)
          notifyError(
            `Signin failed! ${data?.message} `,
            'signin'
          )
          break
      }
    } catch (error) {
      notifyError('Signin failed!', 'signin')
      setForm(initialForm)
    }

    setIsLoading(false)
  }

  return (
    <AuthLayout>
      <form
        className="flex flex-col gap-5"
        onSubmit={handleOnSubmit}>
        <InputLabel
          icon={<HiOutlineMail />}
          label="email Address"
          type="email"
          autoFocus
          required
          value={form.email}
          onChange={handleOnChange}
        />
        <InputLabel
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
          className="sm:h-[60px] h-[50px]"
          isLoading={isLoading}
        />
      </form>
    </AuthLayout>
  )
}

export default Signin
