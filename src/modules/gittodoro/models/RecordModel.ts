import RecordPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/record-system/io/RecordPresenterInterface'
import {
  CreateAllRecordsResponse,
  CreateRecordResponse,
} from '@emaric/gittodoro-ts/lib/interactor/record-system/io/response.model'
import { Record } from './Record'
import RecordModelInterface from './RecordModelInterface'

export class RecordPresenter implements RecordPresenterInterface {
  private callback: CallableFunction

  constructor(callback: CallableFunction) {
    this.callback = callback
  }

  present(response: CreateRecordResponse): Promise<Record> {
    console.log('CALLBACK', response)
    this.callback(response.record)
    return Promise.resolve(response.record)
  }
}

export class RecordsPresenter implements RecordPresenterInterface {
  private callback: CallableFunction

  constructor(callback: CallableFunction) {
    this.callback = callback
  }

  present(response: CreateAllRecordsResponse): Promise<Record[]> {
    console.log('CALLBACK', response)
    this.callback(response.records)
    return Promise.resolve(response.records)
  }
}

export default class RecordModel implements RecordModelInterface {
  readonly recordPresenter: RecordPresenter
  readonly recordsPresenter: RecordsPresenter

  record?: Record
  records: Record[]

  constructor() {
    this.records = []

    this.recordPresenter = new RecordPresenter((record: Record) => {
      console.log('--------------------------------------------------')
      this.record = record
    })

    this.recordsPresenter = new RecordsPresenter((records: Record[]) => {
      console.log('--------------------------------------------------')
      this.records = records || []
    })
  }
}
