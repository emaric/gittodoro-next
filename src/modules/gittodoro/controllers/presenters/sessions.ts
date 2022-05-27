import { SessionPresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionPresenterInterface'
import { SessionBaseResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionResponse'

import { Session } from '@/modules/gittodoro/models/Session'
import { mapSession, mapSessions } from '../../models/mappers'

export type SessionsViewType = {
  session?: Session
  sessions?: Session[]
}

export interface SessionsViewInterface {
  updateView: (value: SessionsViewType) => void
}

export class SessionsPresenter implements SessionPresenterInterface {
  private view: SessionsViewInterface

  constructor(view: SessionsViewInterface) {
    this.view = view
  }

  present(response: SessionBaseResponse): Promise<SessionsViewType> {
    const session = response.session && mapSession(response.session)
    const sessions = response.sessions && mapSessions(response.sessions)
    this.view.updateView({ session, sessions })
    return Promise.resolve({ session, sessions })
  }
}
