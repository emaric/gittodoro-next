import CreateSessionsCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/session/CreateSessionsCommand'
import DeleteSessionsCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/session/DeleteSessionsCommand'
import ReadFirstSessionCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/session/ReadFirstSessionCommand'
import ReadSessionsCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/session/ReadSessionsCommand'
import StartSessionCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/session/StartSessionCommand'
import StopSessionCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/session/StopSessionCommand'

import SessionModelInterface from '@/modules/gittodoro/models/SessionModelInterface'

export default class SessionCommandProvider {
  private model: SessionModelInterface

  private _startCommand?: StartSessionCommand
  private _stopCommand?: StopSessionCommand
  private _createCommand?: CreateSessionsCommand
  private _readCommand?: ReadSessionsCommand
  private _readFirstCommand?: ReadFirstSessionCommand
  private _deleteCommand?: DeleteSessionsCommand

  constructor(model: SessionModelInterface) {
    this.model = model
  }

  get startCommand() {
    if (this._startCommand == undefined) {
      this._startCommand = new StartSessionCommand(
        this.model.dataGateway,
        this.model.startPresenter
      )
    }
    return this._startCommand
  }

  get stopCommand() {
    if (this._stopCommand == undefined) {
      this._stopCommand = new StopSessionCommand(
        this.model.dataGateway,
        this.model.stopPresenter
      )
    }
    return this._stopCommand
  }

  get createCommand() {
    if (this._createCommand == undefined) {
      this._createCommand = new CreateSessionsCommand(
        this.model.dataGateway,
        this.model.createPresenter
      )
    }
    return this._createCommand
  }

  get readCommand() {
    if (this._readCommand == undefined) {
      this._readCommand = new ReadSessionsCommand(
        this.model.dataGateway,
        this.model.readPresenter
      )
    }
    return this._readCommand
  }

  get readFirstCommand() {
    if (this._readFirstCommand == undefined) {
      this._readFirstCommand = new ReadFirstSessionCommand(
        this.model.dataGateway,
        this.model.readFirstPresenter
      )
    }
    return this._readFirstCommand
  }

  get deleteCommand() {
    if (this._deleteCommand == undefined) {
      this._deleteCommand = new DeleteSessionsCommand(
        this.model.dataGateway,
        this.model.deletePresenter
      )
    }
    return this._deleteCommand
  }
}
