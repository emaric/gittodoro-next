import { Record as RecordModel } from '@/gittodoro/models/Record'
import { Note as NoteModel } from '@/gittodoro/models/Note'
import { Session as SessionModel } from '@/gittodoro/models/Session'
import { fromUTC } from '@/modules/temporal/DateTime'

import { Record } from './Record'
import { Note } from './Note'
import { Session } from './Session'

export const mapRecord = (record: RecordModel): Record => {
  return new Record({
    state: record.state,
    start: fromUTC(record.start),
    end: fromUTC(record.end),
  })
}

export const mapRecords = (records: RecordModel[]): Record[] => {
  return records.map((r) => mapRecord(r))
}

export const mapNotes = (notes: NoteModel[]): Note[] => {
  return notes.map((n) => new Note(n))
}

export const mapSessions = (sessions: SessionModel[]): Session[] => {
  return sessions.map((s) => new Session(s))
}
