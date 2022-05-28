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
      records.map((r) => JSON.stringify(r)).join('\n ')
    )
  }
}

export default class RecordAPI {
  private model: RecordModel
  private controller: RecordController

  constructor(view: RecordViewInterface) {
    this.model = new RecordModel()
    this.controller = new RecordController(view, this.model)
  }

  async create(session: Session, current: Date) {
    await this.controller.create(session.duration, session.start, current)
    return this.model.record
  }

  async createAll(session: Session, end: Date) {
    debugger
    const { duration, start } = session
    await this.controller.createAll(duration, start, end)
    return this.model.records
  }

  async createAllForSessions(sessions: Session[]) {
    let records: Record[] = []
    const results = await Promise.all(
      sessions.map((session) => {
        if (session.end) {
          return this.createAll(session, session.end)
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
