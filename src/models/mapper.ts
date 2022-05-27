import { Record as RecordModel } from '@/gittodoro/models/Record'
import { fromUTC } from '@/modules/temporal/DateTime'
import { Record } from './Record'

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
