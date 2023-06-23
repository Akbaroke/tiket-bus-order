import { useDisclosure } from '@mantine/hooks'
import { Group, Modal } from '@mantine/core'
import FormCity from './FormCity'

type Props = {
  cityId: string
}

export default function EditCity({ cityId }: Props) {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[22px] text-[#095BA8] font-bold">
              Edit City
            </h1>
            <span className="h-[1px] w-[200px] bg-[#095BA8]/30"></span>
          </div>
        }
        centered
        padding="xl">
        <FormCity
          type="edit"
          cityId={cityId}
          onClose={close}
        />
      </Modal>

      <Group>
        <p
          onClick={open}
          className="text-[#095BA8] block hover:scale-105 transition-all cursor-pointer">
          Edit
        </p>
      </Group>
    </>
  )
}
