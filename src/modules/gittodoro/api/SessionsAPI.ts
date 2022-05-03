import { SessionController } from '@emaric/gittodoro-ts/lib/controller/SessionController'
import { SessionDataGatewayInterface } from '@emaric/gittodoro-ts/lib/interactor/data-gateways/SessionDataGatewayInterface'
import {
  EndSessionRequest,
  StartSessionRequest,
  ViewFirstAndLastSessionsRequest,
  ViewSessionsByRangeRequest,
} from '@emaric/gittodoro-ts/lib/interactor/requests/SessionRequest'
import { StartSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/StartSessionCommand'
import { EndSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/EndSessionCommand'
import { ViewSessionsByRangeCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewSessionsByRangeCommand'
import { ViewFirstAndLastSessionsCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewFirstAndLastSessionsCommand'

import {
  SessionsPresenter,
  SessionsViewInterface,
  SessionViewType,
} from '../controllers/presenters/sessions'
import { Duration } from '../models/Duration'

export class SessionsAPI {
  controller: SessionController
  view: SessionsViewInterface
  db: SessionDataGatewayInterface

  constructor(view: SessionsViewInterface, db: SessionDataGatewayInterface) {
    this.view = view
    this.db = db
    this.controller = new SessionController()
  }

  private createView(resolve: CallableFunction) {
    return {
      updateView: (value: SessionViewType) => {
        this.view.updateView(value)
        resolve(value)
      },
    }
  }

  private createPresenter(resolve: CallableFunction) {
    return new SessionsPresenter(this.createView(resolve))
  }

  start(duration: Duration, start: Date) {
    const request: StartSessionRequest = {
      timestamp: new Date(),
      message: 'Start a new Session',
      ...duration,
      start,
    }
    return new Promise((resolve) => {
      const interactor = new StartSessionCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.startSession(interactor, request)
    })
  }

  stop(end: Date) {
    const request: EndSessionRequest = {
      timestamp: new Date(),
      message: 'End latest Session',
      end,
    }
    return new Promise((resolve) => {
      const interactor = new EndSessionCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.endSession(interactor, request)
    })
  }

  viewByRange(start: Date, end: Date) {
    const request: ViewSessionsByRangeRequest = {
      timestamp: new Date(),
      message: 'View Sessions by Range',
      start,
      end,
    }
    return new Promise((resolve) => {
      const interactor = new ViewSessionsByRangeCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.viewSessionsByRange(interactor, request)
    })
  }

  viewFirstAndLast() {
    const request: ViewFirstAndLastSessionsRequest = {
      timestamp: new Date(),
      message: 'View First and Last Sessions',
    }
    return new Promise((resolve) => {
      const interactor = new ViewFirstAndLastSessionsCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.viewFirstAndLastSessions(interactor, request)
    })
  }
}
