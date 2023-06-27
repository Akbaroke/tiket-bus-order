import { useDisclosure } from '@mantine/hooks'
import { Group, Modal } from '@mantine/core'
import { HiPlus } from 'react-icons/hi2'
import FormSchedule from './FormSchedule'

export default function AddSchedule() {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[22px] text-[#095BA8] font-bold">
              Add Schedule
            </h1>
            <span className="h-[1px] w-[200px] bg-[#095BA8]/30"></span>
          </div>
        }
        centered
        padding="xl">
        <FormSchedule type="add" onClose={close} />
      </Modal>

      <Group>
        <div
          onClick={open}
          className="grid place-items-center w-[37px] h-[37px] rounded-[10px] bg-[#095BA8] text-[22px] shadow-lg [&>svg]:text-[16px] [&>svg]:text-white cursor-pointer">
          <HiPlus />
        </div>
      </Group>
    </>
  )
}
