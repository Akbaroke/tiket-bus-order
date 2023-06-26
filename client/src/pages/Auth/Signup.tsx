import * as React from 'react'
import axios from '../../api'
import { FormValues } from './Auth.d'
import InputLabel from '../../components/InputLabel'
import { HiOutlineMail } from 'react-icons/hi'
import { BiLockAlt } from 'react-icons/bi'
import Button from '../../components/Button'
import { env } from '../../vite-env.d'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../components/Toast'
import AuthLayout from '../../components/Layouts/AuthLayout'
import { useNavigate } from 'react-router-dom'

const initialForm = {
  email: '',
  password: '',
  confirm: '',
}

function Signup(): JSX.Element {
  const [form, setForm] = React.useState<FormValues>(initialForm)
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

  const handleOnSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    notifyLoading('Signup verify...', 'signup')

    try {
      const { data } = await axios.post(
        `${env.VITE_APP_URL}/auth/register`,
        {
          email: form.email,
          password: form.password,
          confirmPassword: form.confirm,
        }
      )
      switch (data.status) {
        case 200:
          navigate('/signin')
          notifySuccess('Signup successful!', 'signup')
          break
        default:
          notifyError(
            `Signup failed! ${data?.message} `,
            'signup'
          )
          break
      }
    } catch (error) {
      notifyError('Signup failed!', 'signup')
    }

    setIsLoading(false)
    setForm(initialForm)
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
        <InputLabel
          icon={<BiLockAlt />}
          label="confirm password"
          type="password"
          required
          value={form.confirm}
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

export default Signup
