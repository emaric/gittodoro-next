import CreateAllRecordsCommand from '@emaric/gittodoro-ts/lib/interactor/record-system/CreateAllRecordsCommand'
import CreateNthRecordCommand from '@emaric/gittodoro-ts/lib/interactor/record-system/CreateNthRecordCommand'
import CreateRecordCommand from '@emaric/gittodoro-ts/lib/interactor/record-system/CreateRecordCommand'

import { Record } from '../models/Record'
import { Duration } from '../models/Duration'
import RecordModelInterface from '../models/RecordModelInterface'

export interface RecordViewInterface {
  setRecord(record?: Record): void

  setRecords(records: Record[]): void
}

export default class RecordController {
  private view: RecordViewInterface
  private model: RecordModelInterface

  private _createCommand?: CreateRecordCommand
  private _createNthCommand?: CreateNthRecordCommand
  private _createAllCommand?: CreateAllRecordsCommand

  constructor(view: RecordViewInterface, model: RecordModelInterface) {
    this.view = view
    this.model = model
  }

  async create(duration: Duration, start: Date, current: Date) {
    if (this._createCommand == undefined) {
      this._createCommand = new CreateRecordCommand(this.model.recordPresenter)
    }
    await this._createCommand.execute({ duration, start, current })
    this.view.setRecord(this.model.record)
  }

  async createNth(duration: Duration, n: number, start: Date) {
    if (this._createNthCommand == undefined) {
      this._createNthCommand = new CreateNthRecordCommand(
        this.model.recordPresenter
      )
    }
    await this._createNthCommand.execute({ duration, n, start })
    this.view.setRecord(this.model.record)
  }

  async createAll(duration: Duration, start: Date, end: Date) {
    if (this._createAllCommand == undefined) {
      this._createAllCommand = new CreateAllRecordsCommand(
        this.model.recordsPresenter
      )
    }
    await this._createAllCommand.execute({ duration, start, end })
    this.view.setRecords(this.model.records)
  }
}
