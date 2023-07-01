import * as React from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Button, Group, Modal } from '@mantine/core'
import axios from '../../../api'
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from '../../../components/Toast'
import { useSelector } from 'react-redux'
import { useSWRConfig } from 'swr'
import { DataUser } from '../../../interfaces/store'
type Props = {
  scheduleId: string
  name: string
}

interface State {
  user: DataUser
}

export default function DeleteSchedule({
  scheduleId,
  name,
}: Props) {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = React.useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const { encrypt } = useSelector((state: State) => state.user)

  const handleDelete = async () => {
    notifyLoading('Delete processing...', 'delete-schedule')
    setIsLoading(true)
    try {
      await axios.post(`/schedule/delete/${scheduleId}`, {
        encrypt: encrypt,
      })
      mutate('/schedule')
      notifySuccess(
        'Delete schedule successful!',
        'delete-schedule'
      )
    } catch (error) {
      console.log(error)
      notifyError('Delete schedule failed!', 'delete-schedule')
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
              Delete Schedule
            </h1>
            <span className="h-[1px] w-[200px] bg-[#095BA8]/30"></span>
          </div>
        }
        centered
        padding="xl">
        <div className="p-4 min-h-[80px]">
          <p className="text-sm">
            You will remove the "<b>{name}</b>" schedule. Are you
            sure ?
          </p>
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
            onClick={handleDelete}>
            Yes, delete
          </Button>
        </div>
      </Modal>

      <Group>
        <Button onClick={open} variant="outline" color="red">
          Delete
        </Button>
      </Group>
    </>
  )
}
