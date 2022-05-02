import { SessionPresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionPresenterInterface'
import { SessionBaseResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionResponse'
import { mapSession, mapSessions } from './mappers'

export class SessionsPresenter implements SessionPresenterInterface {
  private updateView?: CallableFunction

  constructor(updateView?: CallableFunction) {
    this.updateView = updateView
  }

  setCallback(cb: CallableFunction) {
    this.updateView = cb
  }

  present(response: SessionBaseResponse): void {
    const session = response.session && mapSession(response.session)
    const sessions = response.sessions && mapSessions(response.sessions)
    this.updateView && this.updateView({ session, sessions })
  }
}
