import { useEffect, useRef } from 'react'
import {
  Html5QrcodeScanner,
  Html5QrcodeResult,
} from 'html5-qrcode'

interface Html5QrcodePluginProps {
  fps?: number
  qrbox?: number
  aspectRatio?: number
  disableFlip?: boolean
  verbose?: boolean
  qrCodeSuccessCallback: (
    decodedText: string,
    result: Html5QrcodeResult
  ) => void
  isClose?: boolean
  qrCodeErrorCallback?: (error: Error | string) => void
}

const qrcodeRegionId = 'html5qr-code-full-region'

const createConfig = (props: Html5QrcodePluginProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = {}
  if (props.fps) {
    config.fps = props.fps
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip
  }
  return config
}

const Html5QrcodePlugin: React.FC<
  Html5QrcodePluginProps
> = props => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    const config = createConfig(props)
    const verbose = props.verbose === true

    if (!props.qrCodeSuccessCallback) {
      throw new Error(
        'qrCodeSuccessCallback is a required callback.'
      )
    }

    const createScannerInstance = () => {
      scannerRef.current = new Html5QrcodeScanner(
        qrcodeRegionId,
        config,
        verbose
      )
      scannerRef.current.render(
        props.qrCodeSuccessCallback,
        props.qrCodeErrorCallback
      )
    }

    createScannerInstance()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error(
            'Failed to clear html5QrcodeScanner. ',
            error
          )
        })
      }
    }
  }, [props])

  useEffect(() => {
    if (props.isClose && scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
      console.log('closee')
    }
  }, [props.isClose])

  return <div id={qrcodeRegionId} />
}

export default Html5QrcodePlugin
