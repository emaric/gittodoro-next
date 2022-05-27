import { DateTimeType, difference, now } from '@/modules/temporal/DateTime'

export class Record {
  state: string
  start: DateTimeType
  end: DateTimeType

  constructor(props: {
    state: string
    start: DateTimeType
    end: DateTimeType
  }) {
    this.state = props.state
    this.start = props.start
    this.end = props.end
  }

  get remainingTime() {
    return difference(this.end, now())
  }
}
