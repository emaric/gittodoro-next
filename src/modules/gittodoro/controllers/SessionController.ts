import { SessionController as MainSessionController } from '@emaric/gittodoro-ts/lib/controller/SessionController'
import {
  StartSessionRequest,
  EndSessionRequest,
  ViewSessionsByRangeRequest,
} from '@emaric/gittodoro-ts/lib/interactor/requests/SessionRequest'
import { SessionPresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionPresenterInterface'
import { StartSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/StartSessionCommand'
import { EndSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/EndSessionCommand'
import { ViewSessionsByRangeCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewSessionsByRangeCommand'

import { SessionLocalStorageGateway } from '../db/local/SessionLocalStorageGateway'
import { SessionPresenter, SessionViewInterface } from './presenters/sessions'
import { Duration } from '../models/Duration'

export class SessionController {
  private storage: SessionLocalStorageGateway
  private presenter: SessionPresenterInterface
  private mainController: MainSessionController

  private startCommand: StartSessionCommand
  private endCommand: EndSessionCommand
  private viewByRangeCommand: ViewSessionsByRangeCommand

  constructor(sessionView: SessionViewInterface) {
    this.storage = new SessionLocalStorageGateway()
    this.presenter = new SessionPresenter(sessionView)
    this.mainController = new MainSessionController()

    this.startCommand = new StartSessionCommand(this.storage, this.presenter)
    this.endCommand = new EndSessionCommand(this.storage, this.presenter)
    this.viewByRangeCommand = new ViewSessionsByRangeCommand(
      this.storage,
      this.presenter
    )
  }

  start(duration: Duration, start = new Date()) {
    const request: StartSessionRequest = {
      message: 'Start a new session.',
      start: start,
      ...duration,
    }
    this.mainController.startSession(this.startCommand, request)
  }

  stop(end = new Date()) {
    const request: EndSessionRequest = {
      message: 'Stop the last session',
      end,
    }
    this.mainController.endSession(this.endCommand, request)
  }

  clear() {
    this.storage.clearStorage()
  }

  viewByRange(start: Date, end: Date) {
    const request: ViewSessionsByRangeRequest = {
      message: 'Get sessions by range',
      start,
      end,
    }
    this.mainController.viewSessionsByRange(this.viewByRangeCommand, request)
  }
}
