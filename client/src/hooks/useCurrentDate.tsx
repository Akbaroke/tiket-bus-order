import * as React from 'react'

const useCurrentDate = () => {
  const [dateNow, setDateNow] = React.useState(new Date())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDateNow(new Date())
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return dateNow
}

const useIsTimestampPassed = (timestamp: number): boolean => {
  const currentTimestamp = Math.floor(
    useCurrentDate().getTime() / 1000
  )

  return timestamp < currentTimestamp
}

export default useIsTimestampPassed
