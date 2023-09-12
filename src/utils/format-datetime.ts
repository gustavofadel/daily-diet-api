export function formatDateTime(date: string, time: string): string {
  const dateParts = date.split('/')
  const timeParts = time.split(':')

  const day = parseInt(dateParts[0])
  const month = parseInt(dateParts[1])
  const year = parseInt(dateParts[2])
  const hour = parseInt(timeParts[0])
  const minute = parseInt(timeParts[1])

  const dateTime = new Date(year, month - 1, day, hour, minute)

  // Converting to local time
  dateTime.setTime(
    dateTime.getTime() - dateTime.getTimezoneOffset() * 60 * 1000,
  )

  // Formatting to YYYY/MM/DD HH:MM
  const formattedDateTime = dateTime
    .toISOString()
    .slice(0, 16)
    .replace('T', ' ')

  return formattedDateTime
}
