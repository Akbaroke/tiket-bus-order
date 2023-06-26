import * as React from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Button, Group, Modal } from '@mantine/core'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from './Toast'
import { RiLogoutCircleLine } from 'react-icons/ri'

export default function Logout() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [opened, { open, close }] = useDisclosure(false)

  const handleLogout = async () => {
    notifyLoading('Logout processing...', 'logout')
    setIsLoading(true)
    notifySuccess('Logout successful!', 'logout')
    notifyError('Logout failed!', 'logout')
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
          className="flex gap-[18px] items-center px-9 py-6 w-full border border-x-0 hover:border-y-[#F0EFF2] transition-all cursor-pointer [&>svg]:text-[20px]">
          {<RiLogoutCircleLine />}
          <div className="flex w-full justify-between items-center">
            <p className="text-[14px] font-medium capitalize text-[#FF0202]">
              Logout
            </p>
          </div>
        </div>
      </Group>
    </>
  )
}
