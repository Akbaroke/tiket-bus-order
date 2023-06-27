import * as React from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Button, Group, Modal } from '@mantine/core'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from './Toast'
import { RiLogoutCircleLine } from 'react-icons/ri'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { resetUser } from '../redux/actions/user'

export default function Logout() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    notifyLoading('Logout processing...', 'logout')
    setIsLoading(true)
    try {
      dispatch(resetUser())
      notifySuccess('Logout successful!', 'logout')
    } catch (error) {
      console.log(error)
      notifyError('Logout failed!', 'logout')
    }
    setIsLoading(false)
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[22px] text-[#095BA8] font-bold">
              Logout Confirmation
            </h1>
            <span className="h-[1px] w-[200px] bg-[#095BA8]/30"></span>
          </div>
        }
        centered
        padding="xl">
        <div className="p-4 min-h-[80px]">
          <p className="text-sm">Do you want to logout ?</p>
        </div>
        <div className="flex justify-center gap-4 p-5">
          <Button
            color="#095BA8"
            variant="outline"
            onClick={close}>
            No, back
          </Button>
          <Button
            className="bg-[#FF0202] hover:bg-[#FF0202]/80"
            loading={isLoading}
            onClick={handleLogout}>
            Yes, logout
          </Button>
        </div>
      </Modal>

      <Group>
        <div
          onClick={open}
          className={clsx(
            'flex gap-[18px] items-center px-9 py-6 w-full border border-x-0 border-y-white hover:border-y-[#F0EFF2] transition-all cursor-pointer [&>svg]:text-[20px] hover:text-[#262626]  [&>svg]:hover:text-[#FF0202] ',
            opened
              ? 'text-[#262626] [&>svg]:text-[#FF0202]'
              : 'text-[#9F9F9F] [&>svg]:text-[#FF0202]/50'
          )}>
          <RiLogoutCircleLine />
          <div className="flex w-full justify-between items-center">
            <p className="text-[14px] font-medium capitalize">
              Logout
            </p>
          </div>
        </div>
      </Group>
    </>
  )
}
