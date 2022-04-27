import { SessionViewInterface } from "../controllers/presenters/sessions"
import { Session } from "../models/Session"


export class SessionView implements SessionViewInterface {
  callback: CallableFunction

  constructor(callback: CallableFunction) {
    this.callback = callback
  }

  updateView(session: Session): void {
    this.callback({ session })
  }

  updateViewSessions(sessions: Session[]): void {
    this.callback({ sessions })
  }

}