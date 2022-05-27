import { Session as SessionViewModel } from '@/modules/gittodoro/models/Session'
import { DateTimeType, fromUTC } from '@/modules/temporal/DateTime'

export class Session extends SessionViewModel {
  constructor(session: SessionViewModel) {
    super(session)
  }

  get endPlainDateTime(): DateTimeType | undefined {
    if (this.end) {
      return fromUTC(this.end)
    }
  }

  get startPlainDateTime(): DateTimeType {
    return fromUTC(this.start)
  }

  toString() {
    return JSON.stringify({ session: this.id })
  }
}
