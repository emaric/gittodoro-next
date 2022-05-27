import RecordPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/record-system/io/RecordPresenterInterface'

import { Record } from '@/gittodoro/models/Record'

export default interface RecordModelInterface {
  recordPresenter: RecordPresenterInterface
  recordsPresenter: RecordPresenterInterface

  record?: Record

  records: Record[]
}
