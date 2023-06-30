function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }

  const formattedTime = new Intl.DateTimeFormat(
    'en-US',
    options
  ).format(date)
  return formattedTime
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()

  return `${day}/${month}/${year}`
}

function combineDateTimeToEpochMillis(
  dateString: string,
  timeString: string
): number {
  const date = new Date(dateString)
  const time = timeString.split(':')
  const hours = parseInt(time[0], 10)
  const minutes = parseInt(time[1], 10)

  date.setHours(hours)
  date.setMinutes(minutes)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date.getTime() / 1000
}

function dateToEpochMillis(date: Date): number {
  date.setHours(0, 0, 0, 0)
  return date.getTime() / 1000
}


const isToday = (
  currentTimestamp: number,
  targetTimestamp: number
): boolean => {
  const currentDate = new Date(currentTimestamp)
  const targetDate = new Date(targetTimestamp)
  return (
    currentDate.getFullYear() === targetDate.getFullYear() &&
    currentDate.getMonth() === targetDate.getMonth() &&
    currentDate.getDate() === targetDate.getDate()
  )
}

const isYesterday = (
  currentTimestamp: number,
  targetTimestamp: number
): boolean => {
  const currentDate = new Date(currentTimestamp)
  const targetDate = new Date(targetTimestamp)
  currentDate.setHours(12, 0, 0, 0)
  targetDate.setHours(12, 0, 0, 0)
  currentDate.setDate(currentDate.getDate() - 1)
  return targetDate.getTime() === currentDate.getTime()
}

const isLastWeek = (
  currentTimestamp: number,
  targetTimestamp: number
): boolean => {
  const currentDate = new Date(currentTimestamp)
  const targetDate = new Date(targetTimestamp)
  currentDate.setHours(12, 0, 0, 0)
  targetDate.setHours(12, 0, 0, 0)
  currentDate.setDate(currentDate.getDate() - 7)
  return (
    targetDate.getTime() >= currentDate.getTime() &&
    targetDate.getTime() <
      currentDate.setDate(currentDate.getDate() + 7)
  )
}

const formatDateText = (epochTime: number): string => {
  const date = new Date(epochTime * 1000)

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }

  const formattedDate = new Intl.DateTimeFormat(
    'en-US',
    options
  ).format(date)

  return formattedDate
}

export {
  formatDate,
  formatTime,
  combineDateTimeToEpochMillis,
  dateToEpochMillis,
  isToday,
  isLastWeek,
  isYesterday,
  formatDateText,
}
