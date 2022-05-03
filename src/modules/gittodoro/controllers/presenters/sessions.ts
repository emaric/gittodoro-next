import { SessionPresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionPresenterInterface'
import { SessionBaseResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionResponse'

import { Session } from '@/modules/gittodoro/models/Session'
import { mapSession, mapSessions } from './mappers'

export type SessionViewType = {
  session?: Session
  sessions?: Session[]
}

export interface SessionsViewInterface {
  updateView: (value: SessionViewType) => void
}

export class SessionsPresenter implements SessionPresenterInterface {
  private view: SessionsViewInterface

  constructor(view: SessionsViewInterface) {
    this.view = view
  }

  present(response: SessionBaseResponse): Promise<SessionViewType> {
    const session = response.session && mapSession(response.session)
    const sessions = response.sessions && mapSessions(response.sessions)
    this.view.updateView({ session, sessions })
    return Promise.resolve({ session, sessions })
  }
}
