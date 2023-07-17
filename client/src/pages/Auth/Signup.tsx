import * as React from 'react'
import { BiLockAlt } from 'react-icons/bi'
import { HiOutlineMail } from 'react-icons/hi'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../components/Toast'
import axios from '../../api'
import { useForm } from '@mantine/form'
import { Button, PasswordInput, TextInput } from '@mantine/core'

interface FormValues {
  email: string
  password: string
  confirmPassword: string
}

function Signup({
  setValue,
}: {
  setValue: (value: string) => void
}): JSX.Element {
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false)

  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      email: value => {
        if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            value
          )
        ) {
          return 'Invalid Email'
        }
        return null
      },
      password: value => {
        if (value.length < 8) {
          return 'Password should be at least 8 characters long'
        }
        return null
      },
      confirmPassword: value => {
        if (value.length < 8) {
          return 'Password should be at least 8 characters long'
        }
        if (value !== form.values.password) {
          return 'Passwords do not match'
        }
        return null
      },
    },
  })

  const handleOnSubmit = async (value: FormValues) => {
    setIsLoading(true)
    notifyLoading('Signup verify...', 'signup')

    try {
      const { data } = await axios.post('/auth/register', {
        email: value.email,
        password: value.password,
        confirmPassword: value.confirmPassword,
      })
      if (data.status === 200) {
        notifySuccess('Signup successful!', 'signup')
        form.setValues({
          email: '',
          password: '',
          confirmPassword: '',
        })
        setValue('signin')
      } else {
        notifyError(`Signup failed! ${data.message} `, 'signup')
      }
    } catch (error) {
      console.log(error)
      notifyError('Signup failed!', 'signup')
      form.setValues({
        email: '',
        password: '',
        confirmPassword: '',
      })
    }

    setIsLoading(false)
  }

  return (
    <>
      <h1 className="mb-5 text-lg font-semibold">Signup</h1>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.onSubmit(values => {
          handleOnSubmit(values)
        })}>
        <TextInput
          withAsterisk
          icon={<HiOutlineMail />}
          placeholder="Email"
          error={form.errors.email}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          withAsterisk
          icon={<BiLockAlt />}
          placeholder="Password"
          error={form.errors.password}
          {...form.getInputProps('password')}
        />
        <PasswordInput
          withAsterisk
          icon={<BiLockAlt />}
          placeholder="Confirm Password"
          error={form.errors.confirmPassword}
          {...form.getInputProps('confirmPassword')}
        />
        <Button
          type="submit"
          className="bg-[#095BA8]"
          loading={isLoading}>
          Signup
        </Button>
      </form>
    </>
  )
}

export default Signup
