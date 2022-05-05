import * as DateTime from '@/modules/temporal/DateTime'

export class Clock {
  start: DateTime.DateTimeType
  end: DateTime.DateTimeType
  duration: number

  isAnimateLabel: boolean
  isShowSecondsRing: boolean

  constructor(start = DateTime.today(), end = DateTime.tomorrow()) {
    this.start = start
    this.end = end

    this.duration = DateTime.difference(end, start)

    this.isAnimateLabel = false
    this.isShowSecondsRing = DateTime.difference(end, DateTime.now()) > 0
  }

  get remaining() {
    return DateTime.difference(this.end, DateTime.now())
  }

  get elapsed() {
    return DateTime.difference(DateTime.now(), this.start)
  }

  get ended() {
    return this.remaining <= 0
  }

  get startDate() {
    return new Date(this.start.toJSON())
  }

  get endDate() {
    return new Date(this.end.toJSON())
  }

  toString() {
    return JSON.stringify(this)
  }
}
