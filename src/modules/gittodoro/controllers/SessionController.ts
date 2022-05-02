import { SessionController as MainSessionController } from '@emaric/gittodoro-ts/lib/controller/SessionController'
import {
  StartSessionRequest,
  EndSessionRequest,
  ViewSessionsByRangeRequest,
  ViewFirstAndLastSessionsRequest,
} from '@emaric/gittodoro-ts/lib/interactor/requests/SessionRequest'
import { SessionPresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionPresenterInterface'
import { StartSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/StartSessionCommand'
import { EndSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/EndSessionCommand'
import { ViewSessionsByRangeCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewSessionsByRangeCommand'
import { ViewFirstAndLastSessionsCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewFirstAndLastSessionsCommand'

import { SessionLocalStorageGateway } from '@/modules/gittodoro/db/local/SessionLocalStorageGateway'
import { SessionPresenter, SessionViewInterface } from './presenters/sessions'
import { Duration } from '../models/Duration'

export class SessionController {
  private storage: SessionLocalStorageGateway
  private presenter: SessionPresenterInterface
  private mainController: MainSessionController

  private startCommand: StartSessionCommand
  private endCommand: EndSessionCommand
  private viewByRangeCommand: ViewSessionsByRangeCommand
  private viewFirstAndLastSessionsCommand: ViewFirstAndLastSessionsCommand

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
    this.viewFirstAndLastSessionsCommand = new ViewFirstAndLastSessionsCommand(
      this.storage,
      this.presenter
    )
  }

  start(duration: Duration, start = new Date()) {
    const request: StartSessionRequest = {
      timestamp: new Date(),
      message: 'Start a new session.',
      start: start,
      ...duration,
    }
    this.mainController.startSession(this.startCommand, request)
  }

  stop(end = new Date()) {
    const request: EndSessionRequest = {
      timestamp: new Date(),
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
      timestamp: new Date(),
      message: 'Get sessions by range',
      start,
      end,
    }
    this.mainController.viewSessionsByRange(this.viewByRangeCommand, request)
  }

  viewFirstAndLast() {
    const request: ViewFirstAndLastSessionsRequest = {
      timestamp: new Date(),
      message: 'Get first and last sessions.',
    }
    this.mainController.viewFirstAndLastSessions(
      this.viewFirstAndLastSessionsCommand,
      request
    )
  }
}
