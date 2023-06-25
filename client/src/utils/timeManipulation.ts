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

export { formatDate, formatTime, combineDateTimeToEpochMillis }
