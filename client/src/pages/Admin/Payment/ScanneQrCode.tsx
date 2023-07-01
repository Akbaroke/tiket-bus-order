import { Loader, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { BsQrCodeScan } from 'react-icons/bs'
import Html5QrcodePlugin from '../../../components/Html5QrcodePlugin'
import { useState } from 'react'

export default function ScanneQrCode({
  setResultScanneCode,
}: {
  setResultScanneCode: (code: string) => void
}) {
  const [opened, { open, close }] = useDisclosure(false)
  const [isCloseCamera, setIsCloseCamera] =
    useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onNewScanResult = (decodedText: string) => {
    console.log(decodedText)
    setResultScanneCode(decodedText)
    onClose()
  }

  const onClose = () => {
    setIsCloseCamera(true)
    close()
    setIsCloseCamera(false)
    setIsLoading(false)
  }

  return (
    <>
      <div
        className="grid place-items-center w-[37px] h-[37px] rounded-[10px] bg-white text-[22px] text-[#262626] shadow-lg [&>svg]:text-[18px] cursor-pointer"
        onClick={() => {
          setIsLoading(true)
          open()
        }}>
        {isLoading ? (
          <Loader color="gray" size="sm" />
        ) : (
          <BsQrCodeScan />
        )}
      </div>

      <Modal
        opened={opened}
        onClose={onClose}
        title={
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[22px] text-[#095BA8] font-bold">
              Scanne QrCode
            </h1>
            <span className="h-[1px] w-[200px] bg-[#095BA8]/30"></span>
          </div>
        }
        centered
        padding="xl">
        <div className="p-4 min-h-[80px]">
          <Html5QrcodePlugin
            fps={30}
            qrbox={300}
            disableFlip={false}
            qrCodeSuccessCallback={onNewScanResult}
            isClose={isCloseCamera}
          />
        </div>
      </Modal>
    </>
  )
}
