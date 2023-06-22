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
import { UserInfo } from '../../../redux/reducers/user'
import { useSWRConfig } from 'swr'
type Props = {
  classId: string
  name: string
}

interface State {
  user: UserInfo
}

export default function DeleteClass({
  classId,
  name,
}: Props) {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = React.useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const { encrypt } = useSelector(
    (state: State) => state.user
  )

  const handleDelete = async () => {
    notifyLoading('Delete processing...', 'deleteclass')
    setIsLoading(true)
    try {
      const { data } = await axios.post(
        `/classes/delete/${classId}`,
        {
          encrypt: encrypt,
        }
      )
      console.log(data)
      notifySuccess(
        'Delete class successful!',
        'deleteclass'
      )
      mutate('/classes')
    } catch (error) {
      console.log(error)
      notifyError('Delete class failed!', 'deleteclass')
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
              Edit Class
            </h1>
            <span className="h-[1px] w-[200px] bg-[#095BA8]/30"></span>
          </div>
        }
        centered
        padding="xl">
        <div className="p-4 min-h-[80px]">
          <p className="text-sm">
            You will remove the "<b>{name}</b>" class. Are
            you sure ?
          </p>
        </div>
        <div className="flex justify-center gap-4 p-5">
          <Button
            color="#095BA8"
            variant="outline"
            loading={isLoading}
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
        <p
          onClick={open}
          className="text-[#FF0202] block hover:scale-105 transition-all cursor-pointer">
          Delete
        </p>
      </Group>
    </>
  )
}