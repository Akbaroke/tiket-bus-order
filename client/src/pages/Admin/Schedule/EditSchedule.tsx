import { useDisclosure } from '@mantine/hooks'
import { Group, Modal } from '@mantine/core'
import FormSchedule from './FormSchedule'

type Props = {
  scheduleId: string
  children: React.ReactNode
}

export default function EditSchedule({
  scheduleId,
  children,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[22px] text-[#095BA8] font-bold">
              Edit Schedule
            </h1>
            <span className="h-[1px] w-[200px] bg-[#095BA8]/30"></span>
          </div>
        }
        centered
        padding="xl">
        <FormSchedule
          type="edit"
          scheduleId={scheduleId}
          onClose={close}
        />
      </Modal>

      <Group onClick={open}>{children}</Group>
    </>
  )
}
