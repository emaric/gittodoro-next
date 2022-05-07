import { State } from '@/modules/gittodoro/models/State'
import { DateTimeType, difference, now } from '@/modules/temporal/DateTime'
import { Clock } from './Clock'
import { Session } from './Session'

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

export const createRecord = (session: Session): Record => {
  return new Record({
    state: session.stateString,
    start: now(),
    end: now().add({ seconds: session.timer.duration }),
  })
}

export const generateRecords = (session: Session, end: DateTimeType) => {
  const firstTimer = session.timerSequence[0]
  const records: Record[] = [
    new Record({
      state: State[firstTimer.state],
      start: session.startPlainDateTime,
      end: session.startPlainDateTime.add({
        seconds: firstTimer.duration,
      }),
    }),
  ]

  let timerIndex = 1
  let lastRecord = records[records.length - 1]
  while (lastRecord && difference(end, lastRecord.end) > 0) {
    const timer = session.timerSequence[timerIndex]
    const start = lastRecord.end.add({ seconds: 1 })
    records.push(
      new Record({
        state: State[timer.state],
        start,
        end: start.add({ seconds: timer.duration }),
      })
    )

    timerIndex = timerIndex + 1
    if (timerIndex == session.timerSequence.length) {
      timerIndex = 0
    }
    lastRecord = records[records.length - 1]
  }

  if (lastRecord) {
    lastRecord.end = end
    records[records.length - 1] = lastRecord
  }

  return records
}

export const filterRecords = (clock: Clock, records: Record[]) => {
  return records
    .filter((record) => difference(record.end, clock.start) > 0)
    .filter((record) => difference(clock.end, record.start) > 0)
}

export const generateRecordsFromSessions = (sessions: Session[]) => {
  let records: Record[] = []
  sessions.forEach((session) => {
    if (session.endPlainDateTime) {
      records = [
        ...records,
        ...generateRecords(session, session.endPlainDateTime),
      ]
    }
  })
  return records
}
