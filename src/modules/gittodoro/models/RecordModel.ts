import RecordPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/record-system/io/RecordPresenterInterface'
import {
  CreateAllRecordsResponse,
  CreateRecordResponse,
} from '@emaric/gittodoro-ts/lib/interactor/record-system/io/response.model'
import { Record } from './Record'
import RecordModelInterface from './RecordModelInterface'

export default class RecordModel implements RecordModelInterface {
  readonly recordPresenter: RecordPresenterInterface
  readonly recordsPresenter: RecordPresenterInterface

  record?: Record
  records: Record[]

  constructor() {
    this.records = []

    this.recordPresenter = {
      present: (response: CreateRecordResponse) => {
        this.record = response.record
        return Promise.resolve(this.record)
      },
    }

    this.recordsPresenter = {
      present: (response: CreateAllRecordsResponse) => {
        this.records = response.records
        return Promise.resolve(this.records)
      },
    }
  }
}
