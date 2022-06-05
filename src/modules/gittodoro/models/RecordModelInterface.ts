import RecordPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/record-system/io/RecordPresenterInterface'

import { Record } from '@/gittodoro/models/Record'
import { RecordPresenter, RecordsPresenter } from './RecordModel'

export default interface RecordModelInterface {
  recordPresenter: RecordPresenter
  recordsPresenter: RecordsPresenter
  record?: Record

  records: Record[]
}
