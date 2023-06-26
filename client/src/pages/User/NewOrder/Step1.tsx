import { Card, Input } from '@mantine/core'
import { useForm } from '@mantine/form'
import { TbBus } from 'react-icons/tb'

interface FormValues {
  from: string
  to: string
  date: string
  seatCount: string
}

export default function Step1() {
  const form = useForm<FormValues>({
    initialValues: {
      from: '',
      to: '',
      date: '',
      seatCount: '',
    },

    validate: {
      from: value => {
        if (!/^[a-zA-Z0-9 ]{3,30}$/.test(value)) {
          return 'Invalid className'
        }
        return null
      },
    },
  })
  return (
    <Card shadow="sm" padding="xl">
      <Card.Section>
        <h1 className="text-center text-[#095BA8] text-[22px] font-semibold block w-max pb-2 px-10 border-b border-b-[#095BA8]/20 capitalize m-auto">
          Find bus schedule
        </h1>
      </Card.Section>
      <Card.Section>
        <Input
          icon={<TbBus />}
          placeholder="City name"
          error={form.errors.from}
          {...form.getInputProps('from')}
        />
      </Card.Section>
    </Card>
  )
}
