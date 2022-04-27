import Temporal from '@/modules/temporal/index'

export type DateTimeType = Temporal.PlainDateTime

export const now = () => {
  return Temporal.Now.plainDateTimeISO()
}

export const today = () => {
  return now().with({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0,
  })
}

export const tomorrow = () => {
  return today().add({ days: 1 })
}

export const difference = (d1: DateTimeType, d2: DateTimeType) => {
  return d1.since(d2).total({ unit: 'second' })
}

export const utc = () => {
  return Temporal.Now.instant().toZonedDateTimeISO('UTC').toPlainDateTime()
}

export const fromISO = (iso: string): DateTimeType => {
  return Temporal.PlainDateTime.from(iso.replace('Z', ''))
}

export const fromUTC = (utcDate: Date): DateTimeType => {
  const local = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000
  )
  return fromISO(local.toISOString())
}
