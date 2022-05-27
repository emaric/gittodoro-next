import Duration from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'
import Session from '@emaric/gittodoro-ts/lib/interactor/entities/Session'
import SessionGatewayInterface from '../SessionGatewayInterface'
import gatewayProvider from '.'
import GittodoroError from '../../errors/GittodoroError'

const mapToEntity = (sessionsString: string): Session[] => {
  const objs = JSON.parse(sessionsString)
  return objs.map(
    (obj: any) =>
      new Session(
        obj.id,
        new Duration(
          obj.duration.id,
          obj.duration.pomodoro,
          obj.duration.short,
          obj.duration.long,
          obj.duration.interval
        ),
        new Date(obj.start),
        obj.end ? new Date(obj.end) : undefined
      )
  )
}

const mapToString = (sessions: Session[]) => {
  return JSON.stringify(sessions)
}

export class SessionLocalStorageGateway implements SessionGatewayInterface {
  static SESSIONS_ID = 'gittodoro-sessions'
  static SESSIONS_LAST_ID = 'gittodoro-sessions-last-id'
  static DEFAULT_DURATION_ID = 'gittodoro-default-duration'

  get sessions(): Session[] {
    const sessions = localStorage.getItem(
      SessionLocalStorageGateway.SESSIONS_ID
    )
    if (sessions) {
      return mapToEntity(sessions)
    }
    return []
  }

  private updateSessions(sessions: Session[]) {
    localStorage.setItem(
      SessionLocalStorageGateway.SESSIONS_ID,
      mapToString(sessions)
    )
  }

  private get lastID() {
    const lastIDString = localStorage.getItem(
      SessionLocalStorageGateway.SESSIONS_LAST_ID
    )
    if (lastIDString) {
      return Number(lastIDString)
    } else {
      return -1
    }
  }

  private updateLastID(id: string) {
    localStorage.setItem(
      SessionLocalStorageGateway.SESSIONS_LAST_ID,
      String(id)
    )
  }

  async startWithDuration(
    start: Date,
    pomodoro: number,
    short: number,
    long: number,
    interval: number
  ): Promise<Session> {
    try {
      let duration = await gatewayProvider.durationGateway.findMatch(
        pomodoro,
        short,
        long,
        interval
      )
      if (duration == undefined) {
        duration = await gatewayProvider.durationGateway.create(
          pomodoro,
          short,
          long,
          interval
        )
      }

      return await this.startWithDurationID(start, duration.id)
    } catch (error) {
      return Promise.reject(
        new GittodoroError(
          'Failed to start a Session with Duration.',
          error as Error
        )
      )
    }
  }

  async startWithDurationID(start: Date, durationId: string): Promise<Session> {
    try {
      const duration = (
        await gatewayProvider.durationGateway.readByIDs([durationId])
      )[0]
      const id = String(this.lastID + 1)
      const session = new Session(id, duration, start)

      this.updateSessions([...this.sessions, session])
      this.updateLastID(id)
      return Promise.resolve(session)
    } catch (error) {
      return Promise.reject(
        new GittodoroError(
          'Failed to start a Session with Duration ID.',
          error as Error
        )
      )
    }
  }

  stop(date: Date): Promise<Session | undefined> {
    const last = this.sessions[this.sessions.length - 1]
    if (last && last.end == undefined) {
      last.end = date
      this.updateSessions(
        this.sessions.map((s) => {
          if (s.start.getTime() == last.start.getTime()) {
            s.end = last.end
          }
          return s
        })
      )
      return Promise.resolve(last)
    }
    return Promise.resolve(undefined)
  }

  async createWithDurationID(
    sessions: { durationId: string; start: Date; end?: Date | undefined }[]
  ): Promise<Session[]> {
    try {
      const newSessions = await Promise.all(
        sessions.map(async (session, i) => {
          const id = String(this.lastID + i)
          let durations = await gatewayProvider.durationGateway.readByIDs([
            session.durationId,
          ])
          if (durations[0] == undefined) {
            throw new Error(
              `Duration with ID: ${session.durationId} was not found.`
            )
          }
          const newSession = new Session(
            id,
            durations[0],
            session.start,
            session.end
          )
          return newSession
        })
      )

      this.updateSessions([...this.sessions, ...newSessions])
      const last = newSessions[newSessions.length - 1]
      this.updateLastID(last.id)
      return Promise.resolve(newSessions)
    } catch (error) {
      return Promise.reject(
        new Error('Failed to create a session with duration ID.')
      )
    }
  }

  async createWithDuration(
    sessions: {
      pomodoro: number
      short: number
      long: number
      interval: number
      start: Date
      end?: Date | undefined
    }[]
  ): Promise<Session[]> {
    try {
      const newSessions = await Promise.all(
        sessions.map(async (session, i) => {
          const id = String(this.lastID + i + 1)
          let duration = await gatewayProvider.durationGateway.findMatch(
            session.pomodoro,
            session.short,
            session.long,
            session.interval
          )
          if (duration == undefined) {
            duration = await gatewayProvider.durationGateway.create(
              session.pomodoro,
              session.short,
              session.long,
              session.interval
            )
          }
          const newSession = new Session(
            id,
            duration,
            session.start,
            session.end
          )
          return newSession
        })
      )

      this.updateSessions([...this.sessions, ...newSessions])
      const last = newSessions[newSessions.length - 1]
      this.updateLastID(last.id)
      return Promise.resolve(newSessions)
    } catch (error) {
      return Promise.reject(
        new Error('Failed to create a session with duration.')
      )
    }
  }

  readByRange(startInclusive: Date, end: Date): Promise<Session[]> {
    const sessions = this.sessions.filter((session: Session) => {
      if (
        session.start.getTime() >= startInclusive.getTime() &&
        session.start.getTime() < end.getTime()
      ) {
        return true
      }

      if (session.start.getTime() < startInclusive.getTime()) {
        if (session.end) {
          if (session.end.getTime() >= startInclusive.getTime()) {
            return true
          }
        } else {
          return end.getTime() > Date.now()
        }
      }

      return false
    })
    return Promise.resolve(sessions)
  }

  readByIDs(ids: string[]): Promise<Session[]> {
    throw new Error('Method not implemented.')
  }

  async deleteByRange(startInclusive: Date, end: Date): Promise<Session[]> {
    try {
      const toDelete = await this.readByRange(startInclusive, end)
      return await this.deleteByIDs(toDelete.map((s) => s.id))
    } catch (error) {
      return Promise.reject(new Error('Failed to delete sessions by range.'))
    }
  }

  deleteByIDs(ids: string[]): Promise<Session[]> {
    const sessionsToDelete = this.sessions.filter((session) =>
      ids.includes(session.id)
    )
    this.updateSessions(
      this.sessions.filter((session) => !ids.includes(session.id))
    )
    return Promise.resolve(sessionsToDelete)
  }

  first() {
    const sorted = this.sessions.sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    )
    return Promise.resolve(sorted[0])
  }
}
