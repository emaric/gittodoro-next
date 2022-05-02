import { SessionController } from '@emaric/gittodoro-ts/lib/controller/SessionController'
import {
  EndSessionRequest,
  StartSessionRequest,
  ViewSessionsByRangeRequest,
} from '@emaric/gittodoro-ts/lib/interactor/requests/SessionRequest'
import { StartSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/StartSessionCommand'
import { EndSessionCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/EndSessionCommand'
import { ViewSessionDetailsCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewSessionDetailsCommand'
import { ViewSessionsByRangeCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewSessionsByRangeCommand'
import { ViewFirstAndLastSessionsCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/ViewFirstAndLastSessionsCommand'
import { SessionDataGatewayInterface } from '@emaric/gittodoro-ts/lib/interactor/data-gateways/SessionDataGatewayInterface'

import { Session } from '@/modules/gittodoro/models/Session'
import { Duration } from '@/modules/gittodoro/models/Duration'
import { SessionLocalStorageGateway } from '@/modules/gittodoro/db/local/SessionLocalStorageGateway'
import { SessionsPresenter } from './presenters/sessions'

const source: SessionDataGatewayInterface = new SessionLocalStorageGateway()
const sessionController = new SessionController()
const presenter = new SessionsPresenter()

const startInteractor = new StartSessionCommand(source, presenter)
const endInteractor = new EndSessionCommand(source, presenter)
const viewDetailsInteractor = new ViewSessionDetailsCommand(source, presenter)
const viewByRangeInteractor = new ViewSessionsByRangeCommand(source, presenter)
const viewFirstAndLastInteractor = new ViewFirstAndLastSessionsCommand(
  source,
  presenter
)

export const start = (duration: Duration, start: Date) => {
  const request: StartSessionRequest = {
    timestamp: new Date(),
    message: 'Start a new Session',
    ...duration,
    start,
  }

  return new Promise<{ session: Session }>((resolve) => {
    presenter.setCallback(resolve)
    sessionController.startSession(startInteractor, request)
  })
}

export const stop = (end: Date) => {
  const request: EndSessionRequest = {
    timestamp: new Date(),
    message: 'End latest session',
    end,
  }

  return new Promise<{ session: Session }>((resolve) => {
    presenter.setCallback(resolve)
    sessionController.endSession(endInteractor, request)
  })
}

export const viewDetails = (start: Date) => {
  const request = {
    timestamp: new Date(),
    message: 'View Session Details',
    start,
  }

  return new Promise((resolve) => {
    presenter.setCallback(resolve)
    sessionController.viewSession(viewDetailsInteractor, request)
  })
}

export const viewByRange = (start: Date, end: Date) => {
  const request: ViewSessionsByRangeRequest = {
    timestamp: new Date(),
    message: 'View Sessions by Range',
    start,
    end,
  }

  return new Promise<{ sessions: Session[] }>((resolve) => {
    presenter.setCallback(resolve)
    sessionController.viewSessionsByRange(viewByRangeInteractor, request)
  })
}

export const viewFirstAndLast = () => {
  const request = {
    timestamp: new Date(),
    message: 'View First and Last Sessions.',
  }

  return new Promise<{ sessions: Session[] }>((resolve) => {
    presenter.setCallback(resolve)
    sessionController.viewFirstAndLastSessions(
      viewFirstAndLastInteractor,
      request
    )
  })
}
