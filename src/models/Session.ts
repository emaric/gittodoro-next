import { Session as SessionViewModel } from '@/modules/gittodoro/models/Session'
import { State } from '@/modules/gittodoro/models/State'
import { DateTimeType, fromUTC } from '@/modules/temporal/DateTime'

export class Session extends SessionViewModel {
  static TIMER_DELAY = 2

  constructor(session: SessionViewModel) {
    super(session)
  }

  get stateString() {
    return State[this.timer.state]
  }

  get endPlainDateTime(): DateTimeType | undefined {
    if (this.end) {
      return fromUTC(this.end)
    }
  }

  get startPlainDateTime(): DateTimeType {
    return fromUTC(this.start)
  }
}
