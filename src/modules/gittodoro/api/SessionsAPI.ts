import { SessionController } from '@emaric/gittodoro-ts/lib/controller/SessionController'
import { SessionDataGatewayInterface } from '@emaric/gittodoro-ts/lib/interactor/data-gateways/SessionDataGatewayInterface'
import {
  DeleteAllRequest,
  EndSessionRequest,
  SaveAllRequest,
  SessionModelRequest,
  StartSessionRequest,
  ViewFirstAndLastSessionsRequest,
  ViewSessionsByRangeRequest,
} from '@emaric/gittodoro-ts/lib/interactor/requests/SessionRequest'
import { StartSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/StartSessionCommand'
import { EndSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/EndSessionCommand'
import { ViewSessionsByRangeCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewSessionsByRangeCommand'
import { ViewFirstAndLastSessionsCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewFirstAndLastSessionsCommand'
import { DeleteAllSessionsCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/DeleteAllSessionsCommand'
import { SaveAllSessionsCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/SaveAllSessionsCommand'

import {
  SessionsPresenter,
  SessionsViewInterface,
  SessionsViewType,
} from '@/modules/gittodoro/controllers/presenters/sessions'
import { Duration } from '@/modules/gittodoro/models/Duration'
import { Session } from '@/modules/gittodoro/models/Session'
import { mapSessionsToRequests } from '../controllers/presenters/mappers'

export class SessionsAPI {
  private controller: SessionController
  private view?: SessionsViewInterface
  private db: SessionDataGatewayInterface

  constructor(db: SessionDataGatewayInterface, view?: SessionsViewInterface) {
    this.view = view
    this.db = db
    this.controller = new SessionController()
  }

  private createView(resolve: CallableFunction) {
    return {
      updateView: (value: SessionsViewType) => {
        this.view?.updateView(value)
        resolve(value)
      },
    }
  }

  private createPresenter(resolve: CallableFunction) {
    return new SessionsPresenter(this.createView(resolve))
  }

  start(duration: Duration, start: Date): Promise<SessionsViewType> {
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

  stop(end: Date): Promise<SessionsViewType> {
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

  viewByRange(start: Date, end: Date): Promise<SessionsViewType> {
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

  viewFirstAndLast(): Promise<SessionsViewType> {
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

  deleteSessions(ids: number[]): Promise<SessionsViewType> {
    const request: DeleteAllRequest = {
      timestamp: new Date(),
      message: 'Delete multiple Sessions by IDs.',
      ids,
    }
    return new Promise((resolve) => {
      const interactor = new DeleteAllSessionsCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.deleteAllSessions(interactor, request)
    })
  }

  saveSessions(sessions: Session[]): Promise<SessionsViewType> {
    const requestSessions: SessionModelRequest[] =
      mapSessionsToRequests(sessions)
    const request: SaveAllRequest = {
      timestamp: new Date(),
      message: 'Save multiple Sessions.',
      sessions: requestSessions,
    }
    return new Promise((resolve) => {
      const interactor = new SaveAllSessionsCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.saveAllSessions(interactor, request)
    })
  }
}
