import {
  ReadFirstSessionResponse,
  SessionListResponse,
  StartSessionResponse,
  StopSessionResponse,
} from '@emaric/gittodoro-ts/lib/interactor/external-users/session/io/response.model'
import SessionPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/external-users/session/io/SessionPresenterInterface'

import { Session } from '@/modules/gittodoro/models/Session'
import SessionModelInterface from '@/modules/gittodoro/models/SessionModelInterface'
import { mapSession, mapSessions } from '@/modules/gittodoro/models/mappers'
import SessionGatewayInterface from '@/modules/gittodoro/db/SessionGatewayInterface'

export default class SessionModel implements SessionModelInterface {
  readonly dataGateway: SessionGatewayInterface

  readonly startPresenter: SessionPresenterInterface
  readonly stopPresenter: SessionPresenterInterface
  readonly createPresenter: SessionPresenterInterface
  readonly readPresenter: SessionPresenterInterface
  readonly readFirstPresenter: SessionPresenterInterface
  readonly deletePresenter: SessionPresenterInterface

  started?: Session | undefined
  stopped?: Session | undefined
  created: Session[]
  read: Session[]
  first?: Session | undefined
  deleted: Session[]

  constructor(dataGateway: SessionGatewayInterface) {
    this.dataGateway = dataGateway
    this.startPresenter = {
      present: (response: StartSessionResponse) => {
        this.started = mapSession(response.session)
        return Promise.resolve(this.started)
      },
    }
    this.stopPresenter = {
      present: (response: StopSessionResponse) => {
        this.stopped = response.session && mapSession(response.session)
        return Promise.resolve(this.stopped)
      },
    }
    this.createPresenter = {
      present: (response: SessionListResponse) => {
        this.created = mapSessions(response.sessions)
        return Promise.resolve(this.created)
      },
    }
    this.readPresenter = {
      present: (response: SessionListResponse) => {
        this.read = mapSessions(response.sessions)
        return Promise.resolve(this.read)
      },
    }
    this.readFirstPresenter = {
      present: (response: ReadFirstSessionResponse) => {
        this.first = response.session && mapSession(response.session)
        return Promise.resolve(this.first)
      },
    }
    this.deletePresenter = {
      present: (response: SessionListResponse) => {
        this.deleted = mapSessions(response.sessions)
        return Promise.resolve(this.first)
      },
    }

    this.created = []
    this.read = []
    this.deleted = []
  }
}
