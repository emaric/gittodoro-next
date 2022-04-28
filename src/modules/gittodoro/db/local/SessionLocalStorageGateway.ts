import { SessionDataGatewayInterface } from '@emaric/gittodoro-ts/lib/interactor/data-gateways/SessionDataGatewayInterface'
import { Session } from '@emaric/gittodoro-ts/lib/interactor/entities/Session'
import { Duration } from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'

const mapToEntity = (sessionsString: string): Session[] => {
  const objs = JSON.parse(sessionsString)
  return objs.map(
    (obj: any) =>
      new Session({
        id: obj.id,
        start: new Date(obj.start),
        end: obj.end ? new Date(obj.end) : undefined,
        duration: new Duration({ ...obj.duration }),
      })
  )
}

const mapToString = (sessions: Session[]) => {
  return JSON.stringify(sessions)
}

export class SessionLocalStorageGateway implements SessionDataGatewayInterface {
  static SESSIONS_ID = 'gittodoro-sessions'
  static SESSIONS_LAST_ID = 'gittodoro-sessions-last-id'
  static DEFAULT_DURATION_ID = 'gittodoro-default-duration'

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

  private updateLastID(id: number) {
    localStorage.setItem(
      SessionLocalStorageGateway.SESSIONS_LAST_ID,
      String(id)
    )
  }

  createSession(args: {
    start: Date
    pomodoro: number
    short: number
    long: number
    longInterval: number
  }): Session {
    const id = this.lastID + 1
    const session = new Session({
      ...args,
      id,
      duration: new Duration({
        ...args,
        id: -1,
      }),
    })

    const sessions = this.sessions
    sessions.push(session)
    this.updateSessions(sessions)
    this.updateLastID(id)
    return this.readSession(session.start)
  }

  readSession(start: Date): Session {
    const session = this.sessions.find(
      (session) => session.start.getTime() == start.getTime()
    )

    if (session) {
      return session
    }

    throw new Error('Session not found')
  }

  endSession(end: Date): Session {
    const last = this.sessions[this.sessions.length - 1]
    if (last) {
      if (last.end) {
        throw new Error('No active session.')
      }
      last.end = end
      this.updateSessions(
        this.sessions.map((s) => {
          if (s.start.getTime() == last.start.getTime()) {
            s.end = last.end
          }
          return s
        })
      )
      return last
    }
    throw new Error('Sessions storage is empty.')
  }

  clearStorage() {
    this.updateSessions([])
  }

  get sessions(): Session[] {
    const sessions = localStorage.getItem(
      SessionLocalStorageGateway.SESSIONS_ID
    )
    if (sessions) {
      return mapToEntity(sessions)
    }
    return []
  }

  viewSessionsByRange(start: Date, end: Date): Session[] {
    const sessions = this.sessions.filter((session: Session) => {
      if (
        session.start.getTime() >= start.getTime() &&
        session.start.getTime() < end.getTime()
      ) {
        return true
      }

      if (session.start.getTime() < start.getTime()) {
        if (session.end) {
          if (session.end.getTime() >= start.getTime()) {
            return true
          }
        } else {
          return end.getTime() > Date.now()
        }
      }

      return false
    })
    return sessions
  }
}
