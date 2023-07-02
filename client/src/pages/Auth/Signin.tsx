import * as React from 'react'
import { BiLockAlt } from 'react-icons/bi'
import { HiOutlineMail } from 'react-icons/hi'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../components/Toast'
import axios from '../../api'
import { useDispatch } from 'react-redux/es/exports'
import { setUser } from '../../redux/actions/user'
import { useForm } from '@mantine/form'
import { Button, PasswordInput, TextInput } from '@mantine/core'

interface FormValues {
  email: string
  password: string
}

function Signin(): JSX.Element {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false)

  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
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
    },
  })

  const handleOnSubmit = async (value: FormValues) => {
    setIsLoading(true)
    notifyLoading('Signin verify...', 'signin')

    try {
      const { data } = await axios.post('/auth/login', {
        email: value.email,
        password: value.password,
      })

      if (data.status === 200) {
        dispatch(setUser(data.data))
        notifySuccess('Signin successful!', 'signin')
        form.setValues({
          email: '',
          password: '',
        })
      } else {
        notifyError(`Signin failed! ${data.message} `, 'signin')
      }
    } catch (error) {
      console.log(error)
      notifyError('Signin failed!', 'signin')
      form.setValues({
        email: '',
        password: '',
      })
    }

    setIsLoading(false)
  }

  return (
    <>
      <h1 className="mb-5 text-lg font-semibold">Signin</h1>
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
        <Button
          type="submit"
          className="bg-[#095BA8]"
          loading={isLoading}>
          Signin
        </Button>
      </form>
    </>
  )
}

export default Signin
