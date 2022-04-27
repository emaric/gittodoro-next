import { Session } from '@/modules/gittodoro/models/Session'
import { SessionPresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionPresenterInterface'
import { SessionBaseResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionResponse'
import { mapSession } from './mappers'

export interface SessionViewInterface {
  updateView(session: Session): void
  updateViewSessions(sessions: Session[]): void
}

export class SessionPresenter implements SessionPresenterInterface {
  sessionView: SessionViewInterface

  constructor(sessionView: SessionViewInterface) {
    this.sessionView = sessionView
  }

  present(response: SessionBaseResponse): void {
    response.session &&
      this.sessionView.updateView(mapSession(response.session))
    response.sessions &&
      this.sessionView.updateViewSessions(
        response.sessions.map((session) => mapSession(session))
      )
  }
}
