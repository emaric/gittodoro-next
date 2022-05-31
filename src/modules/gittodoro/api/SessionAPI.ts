import GittodoroError from '../errors/GittodoroError'
import { Duration } from '../models/Duration'
import { Session } from '../models/Session'
import SessionModel from '../models/SessionModel'
import SessionModelInterface from '../models/SessionModelInterface'
import {
  SessionController,
  SessionViewInterface,
} from '../controllers/SessionController'
import SessionGatewayInterface from '../db/SessionGatewayInterface'
import Logger from '../utils/Logger'

export class SessionLogger implements SessionViewInterface {
  private logger: Logger

  constructor(name: string) {
    this.logger = new Logger(name)
  }

  setStarted(session?: Session): void {
    this.logger.log('Started a Session.', JSON.stringify(session))
  }

  setStopped(session?: Session): void {
    this.logger.log('Stopped a Session.', JSON.stringify(session))
  }

  setCreated(sessions: Session[]): void {
    this.logger.log(
      'Created Sessions.',
      sessions.map((s) => JSON.stringify(s)).join('\n')
    )
  }

  setReadByRange(sessions: Session[]): void {
    this.logger.log(
      'Read sessions by range.',
      sessions.map((s) => JSON.stringify(s)).join('\n')
    )
  }

  setFirst(session?: Session): void {
    this.logger.log('Read the first session.', JSON.stringify(session))
  }

  setDeleted(sessions: Session[]): void {
    this.logger.log(
      'Deleted sessions.',
      sessions.map((s) => JSON.stringify(s)).join('\n')
    )
  }
}

export default class SessionAPI {
  private model: SessionModelInterface
  private controller: SessionController

  constructor(
    dataGateway: SessionGatewayInterface,
    view?: SessionViewInterface
  ) {
    this.model = new SessionModel(dataGateway)
    this.controller = new SessionController(this.model, view)
  }

  async start(duration: Duration, start: Date): Promise<Session> {
    await this.controller.start(duration, start)
    if (this.model.started) return this.model.started
    return Promise.reject(new GittodoroError('Failed to start a session.'))
  }

  async stop(end: Date): Promise<Session | undefined> {
    await this.controller.stop(end)
    return this.model.stopped
  }

  async save(sessions: Session[]): Promise<Session[]> {
    await this.controller.createWithDuration(sessions)
    return this.model.created
  }

  async readByRange(startInclusive: Date, end: Date): Promise<Session[]> {
    await this.controller.readByRange(startInclusive, end)
    return this.model.read
  }

  async first(): Promise<Session | undefined> {
    await this.controller.readFirst()
    return this.model.first
  }

  async deleteByIDs(ids: string[]): Promise<Session[]> {
    await this.controller.deleteByIDs(ids)
    return this.model.deleted
  }
}
