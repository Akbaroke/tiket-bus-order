import * as React from 'react'
import clsx from 'clsx'
import InputAuth from '../components/InputAuth'
import { HiOutlineMail } from 'react-icons/hi'
import { BiLockAlt } from 'react-icons/bi'
import Button from '../components/Button'
import axios from '../api'

type FormValues = {
  email: string
  password: string
  confirm?: string
}

const initialForm = {
  email: '',
  password: '',
  confirm: '',
}

function Auth() {
  const [switchForm, setSwitchForm] =
    React.useState<boolean>(false)

  return (
    <div className="grid place-items-center min-h-screen">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-center items-center gap-1 mb-3">
          <h1 className="font-semibold text-black text-[22px]">
            Welcome Back
          </h1>
          <h3 className="font-medium text-[#CACACA] text-[14px]">
            Welcome Back, Please enter your details
          </h3>
        </div>
        <div className="bg-[#F0EFF2] rounded-[10px] p-[5px] flex mb-5">
          <div
            className={clsx(
              !switchForm
                ? 'bg-white text-black'
                : 'bg-transparent text-[#9F9F9F] cursor-pointer',
              'text-center text-[16px] font-semibold rounded-[10px] w-[200px] h-[50px] grid place-items-center'
            )}
            onClick={() => setSwitchForm(false)}>
            Sign In
          </div>
          <div
            className={clsx(
              switchForm
                ? 'bg-white text-black'
                : 'bg-transparent text-[#9F9F9F] cursor-pointer',
              'text-center text-[16px] font-semibold rounded-[10px] w-[200px] h-[50px] grid place-items-center'
            )}
            onClick={() => setSwitchForm(true)}>
            Signup
          </div>
        </div>
        {!switchForm ? <Signin /> : <Signup />}
      </div>
    </div>
  )
}

function Signin() {
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

    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_URL}/auth/login`,
      {
        email: form.email,
        password: form.password,
      }
    )
    console.log(data)

    setIsLoading(false)
    setForm(initialForm)
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
        required
        value={form.password}
        onChange={handleOnChange}
      />
      <Button
        type="submit"
        text="Continue"
        className="h-[60px]"
      />
    </form>
  )
}

function Signup() {
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

    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_URL}/auth/register`,
      {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirm,
      }
    )
    console.log(data)

    setIsLoading(false)
    setForm(initialForm)
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
      <InputAuth
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
        className="h-[60px]"
      />
    </form>
  )
}

export default Auth
