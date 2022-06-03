import { Clock } from './Clock'
import { Session } from './Session'
import { Record } from './Record'
import { Note } from './Note'

export default class DayModel {
  clock: Clock
  sessions: Session[]
  records: Record[]
  notes: Note[]

  constructor(
    clock: Clock,
    sessions: Session[],
    records: Record[],
    notes: Note[]
  ) {
    this.clock = clock
    this.sessions = sessions
    this.records = records
    this.notes = notes
  }

  get id() {
    return this.clock.start.toJSON()
  }
}
