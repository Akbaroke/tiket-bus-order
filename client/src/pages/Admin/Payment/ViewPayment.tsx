import * as React from 'react'
import HeaderAdmin from '../../../components/Layouts/HeaderAdmin'
import ScanneQrCode from './ScanneQrCode'
import { Button, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import axios from '../../../api'
import {
  Orders,
  useSWRContext,
} from '../../../contexts/swr-context'
import { ordersByCode } from '../../../utils/getDataFromSwr'
import { formatDateText } from '../../../utils/timeManipulation'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import rupiahFormat from '../../../utils/rupiahFormat'
import { GiReceiveMoney } from 'react-icons/gi'
import { useSelector } from 'react-redux'
import { DataUser } from '../../../interfaces/store'
import { useSWRConfig } from 'swr'
import Etiket from './Etiket'

interface FormValues {
  code: string
}

export interface ResultCheckOrder {
  amountSeats: string
  email: string
  scheduleId: string
  total_price: number
}

interface State {
  user: DataUser
}

export default function ViewPayment() {
  const { mutate } = useSWRConfig()
  const swrContext = useSWRContext()
  const orders: Orders[] | undefined = swrContext?.orders
  const [resultScanneCode, setsetResultScanneCode] =
    React.useState<string>('')
  const { encrypt } = useSelector((state: State) => state.user)
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false)
  const [dataOrder, setDataOrder] =
    React.useState<ResultCheckOrder | null>(null)
  const [expiredTime, setExpiredTime] = React.useState<number>(0)
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const hasExpired = isExpired(expiredTime)

  const form = useForm<FormValues>({
    initialValues: {
      code: '',
    },

    validate: {
      code: value => {
        if (!/^[a-zA-Z0-9]{7,10}$/.test(value)) {
          return 'Invalid Code'
        }
        return null
      },
    },
  })

  React.useEffect(() => {
    if (resultScanneCode) {
      form.setValues({
        code: resultScanneCode,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultScanneCode])

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true)
    const { data } = await axios.get(
      `/order/getByCode/${values.code}`
    )

    checkExpired(values.code)
    setDataOrder(data.data)
    setIsLoading(false)
  }

  const checkExpired = (code: string) => {
    setExpiredTime(Number(ordersByCode(code, orders)?.expiredAt))
    if (ordersByCode(code, orders)?.expiredAt === null) {
      notifyError('Order asbeen Paid!', 'check-payment')
    }
  }

  const handleRecievePayment = async () => {
    notifyLoading('Payment processing...', 'received-payment')
    setIsLoading(true)

    try {
      const { data } = await axios.post('/payment', {
        code: form.values.code,
        pay: dataOrder?.total_price,
        encrypt: encrypt,
      })
      if (data.status === 200) {
        setIsOpen(false)
        setDataOrder(null)
        form.setValues({ code: '' })
        mutate('/schedule')
        mutate('/order')
        notifySuccess('Payment successful!', 'received-payment')
      } else {
        notifyError(
          `Payment failed!, ${data.message}`,
          'received-payment'
        )
      }
    } catch (error) {
      console.log(error)
      notifyError('Payment failed!', 'received-payment')
    }

    setIsLoading(false)
  }

  React.useEffect(() => {
    if (expiredTime !== 0) {
      if (hasExpired) {
        notifyError(
          'Code Booking Hasbeen Expired Time!',
          'check-expired'
        )
      } else {
        setIsOpen(true)
      }
    }
  }, [expiredTime, hasExpired])

  return (
    <div className="p-10">
      <HeaderAdmin title="payment order">
        <ScanneQrCode
          setResultScanneCode={setsetResultScanneCode}
        />
      </HeaderAdmin>
      <div className="p-5 rounded-[10px] shadow-md bg-white">
        <form
          onSubmit={form.onSubmit(values => {
            handleSubmit(values)
          })}
          className="flex items-center gap-2">
          <div className="flex-1 h-20">
            <TextInput
              withAsterisk
              label="Code Booking"
              placeholder="Input here"
              error={form.errors.code}
              {...form.getInputProps('code')}
            />
          </div>
          <div className="h-20 grid place-items-center relative top-[2px]">
            <Button
              type="submit"
              className="bg-[#095BA8] "
              loading={isLoading}>
              Check
            </Button>
          </div>
        </form>
      </div>

      {isOpen && dataOrder ? (
        <>
          <div className="mt-5">
            <h1 className="font-semibold text-[#262626] text-[14px] ml-2">
              Payment Info :
            </h1>
            <div className="p-5 rounded-[10px] shadow-md bg-white mt-2 ">
              <div className="flex justify-between [&>ul]:flex [&>ul]:flex-col [&>ul]:gap-3">
                <ul className="text-sm text-gray-500">
                  <li>User Email</li>
                  <li>Booking</li>
                  <li>Purchased</li>
                  <li>Payment Method</li>
                  <li>Total Price</li>
                </ul>
                <ul className="text-sm text-[#262626] text-end">
                  <li>{dataOrder?.email}</li>
                  <li>{dataOrder?.amountSeats} Seat</li>
                  <li>
                    {formatDateText(
                      ordersByCode(form.values.code, orders)
                        ?.createdAt || 0
                    )}
                  </li>
                  <li>Cash (COD)</li>
                  <li className="font-semibold">
                    {rupiahFormat(dataOrder?.total_price || 0)}
                  </li>
                </ul>
              </div>
              <Button
                className="bg-[#095BA8] w-full mt-4"
                rightIcon={<GiReceiveMoney />}
                loading={isLoading}
                onClick={handleRecievePayment}>
                Receive Payment
              </Button>
            </div>
          </div>
          <Etiket code={form.values.code} data={dataOrder} />
        </>
      ) : null}
    </div>
  )
}

function isExpired(timestamp: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000)

  return timestamp < currentTime
}
