import { SessionDataGatewayInterface } from '@emaric/gittodoro-ts/lib/interactor/data-gateways/SessionDataGatewayInterface'
import { Session } from '@emaric/gittodoro-ts/lib/interactor/entities/Session'
import {
  setUserSession,
  retrieveLatestSession,
  updateSession,
  retrieveOldestSession,
  retrieveSessionsByRange,
  retrieveSession,
  retrieveLatestActiveSession,
} from '@/modules/gittodoro-firebase/controllers/sessions'
import { Duration } from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'

const createID = (date: Date) => {
  return Number(date.toJSON().replaceAll(/-|\.|\:|T|Z/g, ''))
}

export class SessionFirebaseGateway implements SessionDataGatewayInterface {
  async createSession(args: {
    start: Date
    pomodoro: number
    short: number
    long: number
    longInterval: number
  }): Promise<Session> {
    const id = createID(args.start)
    const session = new Session({
      ...args,
      id,
      duration: new Duration({
        ...args,
        id: -1,
      }),
    })
    await setUserSession(String(id), session)
    const result = await retrieveSession(String(id))
    if (result) return result
    throw new Error('Error on `SessionFirebaseGateway.createSession`.')
  }

  readSession(start: Date): Promise<Session> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = createID(start)
        const session = await retrieveSession(String(id))
        if (session) resolve(session)
      } catch (error) {
        reject(error)
        reject(
          new Error(
            'Error on `SessionFirebaseGateway.readSession > retrieveSession(...)`.'
          )
        )
      }
      reject(
        new Error(
          'Error on `SessionFirebaseGateway.readSession(...)`. No Session found.'
        )
      )
    })
  }

  endSession(end: Date): Promise<Session> {
    return new Promise(async (resolve, reject) => {
      try {
        const session = await retrieveLatestActiveSession()
        if (session) {
          session.end = end
          await updateSession(session)
          resolve(session)
        }
      } catch (error) {
        reject(error)
        reject(
          new Error(
            'Error on `SessionFirebaseGateway.endSession > retrieveLatestSession()`.'
          )
        )
      }
    })
  }

  async viewSessionsByRange(start: Date, end: Date): Promise<Session[]> {
    try {
      const sessions = await retrieveSessionsByRange(start, end)
      if (sessions) return sessions
    } catch (error) {
      console.error(error)
      throw new Error('Error trying to retrieve sessions by range. ' + error)
    }
    throw new Error(
      'Error on `SessionFirebaseGateway.viewSessionsByRange(...)`. No sessions found.'
    )
  }

  async first(): Promise<Session> {
    try {
      const session = await retrieveOldestSession()
      if (session) return session
    } catch (error) {
      throw new Error('Error trying to get the first session. ' + error)
    }
    throw new Error('No sessions found.')
  }

  async last(): Promise<Session> {
    try {
      const session = await retrieveLatestSession()
      if (session) return session
    } catch (error) {
      throw new Error('Error trying to get the last session. ' + error)
    }
    throw new Error('No sessions found.')
  }

  async saveAllSessions(sessions: Session[]) {
    const result = await Promise.all(
      sessions.map((session) => {
        session.id = createID(session.start)
        setUserSession(String(session.id), session)
      })
    )
    console.log(result)
  }
}
