import { useDisclosure } from '@mantine/hooks'
import { Group, Modal } from '@mantine/core'
import FormArmada from './FormArmada'

type Props = {
  armadaId: string
}

export default function EditArmada({ armadaId }: Props) {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[22px] text-[#095BA8] font-bold">
              Edit Armada
            </h1>
            <span className="h-[1px] w-[200px] bg-[#095BA8]/30"></span>
          </div>
        }
        centered
        padding="xl">
        <FormArmada
          type="edit"
          armadaId={armadaId}
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
