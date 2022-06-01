import RecordController, {
  RecordViewInterface,
} from '../controllers/RecordController'
import { Record } from '../models/Record'
import RecordModel from '../models/RecordModel'
import { Session } from '../models/Session'
import Logger from '../utils/Logger'

export class RecordLogger implements RecordViewInterface {
  private logger: Logger

  constructor(name: string) {
    this.logger = new Logger(name)
  }

  setRecord(record: Record): void {
    this.logger.log('Created a Record.', JSON.stringify(record))
  }

  setRecords(records: Record[]): void {
    this.logger.log(
      'Created Records.',
      records
        .map((r) => JSON.stringify(r.end.getTime() - r.start.getTime()))
        .join('\n ')
    )
  }
}

export default class RecordAPI {
  private model: RecordModel
  private controller: RecordController

  constructor(view?: RecordViewInterface) {
    this.model = new RecordModel()
    this.controller = new RecordController(this.model, view)
  }

  async create(session: Session, current: Date) {
    await this.controller.create(session.duration, session.start, current)
    return this.model.record
  }

  async createAll(session: Session, end: Date) {
    const { duration, start } = session
    await this.controller.createAll(duration, start, end)
    return this.model.records
  }

  async createAllForSessions(sessions: Session[]) {
    let records: Record[] = []
    const results = await Promise.all(
      sessions.map(async (session) => {
        if (session.end) {
          const _records = await this.createAll(session, session.end)
          _records[_records.length - 1].end = session.end
          return _records
        }
        return []
      })
    )
    results.forEach((result) => {
      records = records.concat(result)
    })
    return records
  }
}
