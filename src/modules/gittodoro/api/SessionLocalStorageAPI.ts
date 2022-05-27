import GittodoroError from '../errors/GittodoroError'
import gatewayProvider from '../db/local'
import { Duration } from '../models/Duration'
import { Session } from '../models/Session'
import SessionModel from '../models/SessionModel'
import SessionModelInterface from '../models/SessionModelInterface'
import {
  SessionController,
  SessionViewInterface,
} from '../controllers/SessionController'

class SessionLogger implements SessionViewInterface {
  private log(message?: string, ...subtexts: string[]) {
    const dateTag = new Date().toJSON()
    console.log(dateTag + ' [session] ' + message, ...subtexts, '\n')
  }

  setStarted(session?: Session): void {
    this.log('Started a Session.', JSON.stringify(session))
  }

  setStopped(session?: Session): void {
    this.log('Stopped a Session.', JSON.stringify(session))
  }

  setReadByRange(sessions: Session[]): void {
    this.log(
      'Read sessions by range.',
      sessions.map((s) => JSON.stringify(s)).join('\n')
    )
  }

  setFirst(session?: Session): void {
    this.log('Read the first session.', JSON.stringify(session))
  }
}

export default class SessionLocalStorageAPI {
  private model: SessionModelInterface
  private controller: SessionController

  constructor() {
    const view = new SessionLogger()
    this.model = new SessionModel(gatewayProvider.sessionGateway)
    this.controller = new SessionController(view, this.model)
  }

  async start(duration: Duration, start: Date): Promise<Session> {
    await this.controller.start(duration, start)
    if (this.model.started) return Promise.resolve(this.model.started)
    return Promise.reject(new GittodoroError('Failed to start a session.'))
  }

  async stop(end: Date): Promise<Session | undefined> {
    await this.controller.stop(end)
    return Promise.resolve(this.model.stopped)
  }

  async readByRange(startInclusive: Date, end: Date): Promise<Session[]> {
    await this.controller.readByRange(startInclusive, end)
    return Promise.resolve(this.model.read)
  }
}
