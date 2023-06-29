import { InputBase, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import * as React from 'react'
import { IMaskInput } from 'react-imask'
import { useDispatch, useSelector } from 'react-redux'
import { setFormOrder } from '../../../redux/actions/order'
import { StateOrder } from '../../../redux/reducers/order'

interface FormValues {
  name: string
  contact: string
  passenger: number
}

interface State {
  order: StateOrder
}

export default function FormPassenger({
  passenger,
  isOpen,
}: {
  passenger: number
  isOpen: boolean
}) {
  const dispatch = useDispatch()
  const { formOrder } = useSelector(
    (state: State) => state.order
  )

  const form = useForm<FormValues>({
    validateInputOnChange: true,
    initialValues: {
      name: '',
      contact: '',
      passenger: passenger,
    },

    validate: {
      name: value => {
        if (!/^[a-zA-Z0-9 ]{3,30}$/.test(value)) {
          return 'Invalid name'
        }
        return null
      },
      contact: value => {
        if (!/^(\d{11}|\d{12}|\d{13})$/.test(value)) {
          return 'Invalid phone number'
        }
        return null
      },
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      const result = formOrder
        .filter(item => item.passenger === passenger)
        .map(item => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { isValid, ...rest } = item
          return rest
        })
      form.setValues(result[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  React.useEffect(() => {
    if (form.isValid()) {
      dispatch(setFormOrder({ isValid: true, ...form.values }))
    } else {
      dispatch(setFormOrder({ isValid: false, ...form.values }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values])

  return (
    <form className="flex flex-col gap-2">
      <TextInput
        size="sm"
        withAsterisk
        label="Name"
        placeholder="Full name"
        max="30"
        error={form.errors.name}
        {...form.getInputProps('name')}
      />
      <InputBase
        withAsterisk
        size="sm"
        label="Phone Number"
        component={IMaskInput}
        mask="0000000000000"
        placeholder="081234567890"
        error={form.errors.contact}
        {...form.getInputProps('contact')}
      />
    </form>
  )
}
