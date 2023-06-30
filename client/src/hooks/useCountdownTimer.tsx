import { useState, useEffect } from 'react'

const useCountdownTimer = (epochTime: number): string => {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000)
      const remainingTime = epochTime - currentTime

      if (remainingTime <= 0) {
        setCountdown('00:00:00')
        clearInterval(interval)
      } else {
        const hours = Math.floor(remainingTime / 3600)
        const minutes = Math.floor((remainingTime % 3600) / 60)
        const seconds = remainingTime % 60

        const formattedHours = String(hours).padStart(2, '0')
        const formattedMinutes = String(minutes).padStart(2, '0')
        const formattedSeconds = String(seconds).padStart(2, '0')

        setCountdown(
          `${formattedHours}h:${formattedMinutes}m:${formattedSeconds}s`
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [epochTime])

  return countdown
}

export default useCountdownTimer
