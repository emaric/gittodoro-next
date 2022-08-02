import {
  setUserSession,
  retrieveLatestSession,
  updateSession,
  retrieveOldestSession,
  retrieveSessionsByRange,
  retrieveSession,
  retrieveLatestActiveSession,
  saveSessions as saveAllSessions,
  deleteSessionsByIDs,
  retrieveSessionsByIDs,
} from '@/modules/gittodoro-firebase/controllers/sessions'
import Session from '@emaric/gittodoro-ts/lib/interactor/entities/Session'
import { gatewayProvider } from '.'
import SessionGatewayInterface from '../gittodoro/db/SessionGatewayInterface'
import GittodoroError from '../../errors/GittodoroError'

import { createID } from './utils'

export class SessionFirebaseGateway implements SessionGatewayInterface {
  public async startWithDurationID(
    start: Date,
    durationId: string
  ): Promise<Session> {
    const id = createID(start)
    const [duration] = await gatewayProvider.durationGateway.readByIDs([
      durationId,
    ])
    const session = new Session(id, duration, start)
    await setUserSession(id, session)
    const result = await retrieveSession(id)
    if (result) return result
    throw new GittodoroError(
      'Error on `SessionFirebaseGateway.startWithDurationID`.'
    )
  }

  public async startWithDuration(
    start: Date,
    pomodoro: number,
    short: number,
    long: number,
    interval: number
  ): Promise<Session> {
    const id = createID(start)
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

    if (duration == undefined) {
      throw new GittodoroError('Failed tyring to save a new Duration.')
    }

    const session = new Session(id, duration, start)
    await setUserSession(id, session)
    const result = await retrieveSession(id)
    if (result) return result
    throw new GittodoroError(
      'Error on `SessionFirebaseGateway.startWithDuration`.'
    )
  }

  async stop(date: Date): Promise<Session | undefined> {
    try {
      const session = await retrieveLatestActiveSession()
      if (session) {
        session.end = date
        await updateSession(session)
        return session
      }
    } catch (error) {
      throw new GittodoroError(
        'Error on `SessionFirebaseGateway.endSession > retrieveLatestSession()`.',
        error as Error
      )
    }
  }

  async createWithDurationID(
    sessions: { durationId: string; start: Date; end?: Date | undefined }[]
  ): Promise<Session[]> {
    const sessionsWithAssignedIDs = await Promise.all(
      sessions.map(async (request) => {
        const id = createID(request.start)
        const [duration] = await gatewayProvider.durationGateway.readByIDs([
          request.durationId,
        ])
        return new Session(id, duration, request.start, request.end)
      })
    )
    const ids: string[] = sessionsWithAssignedIDs.map((s) => s.id)
    await saveAllSessions(ids, sessionsWithAssignedIDs)
    return await retrieveSessionsByIDs(ids)
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
    const sessionsWithAssignedIDs = await Promise.all(
      sessions.map(async (request) => {
        const id = createID(request.start)
        const { pomodoro, short, long, interval } = request
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

        if (duration == undefined) {
          throw new GittodoroError(
            'Failed while trying to save a new Duration.'
          )
        }
        return new Session(id, duration, request.start, request.end)
      })
    )
    const ids: string[] = sessionsWithAssignedIDs.map((s) => s.id)
    await saveAllSessions(ids, sessionsWithAssignedIDs)
    return await retrieveSessionsByIDs(ids)
  }

  async readByRange(startInclusive: Date, end: Date): Promise<Session[]> {
    try {
      const sessions = await retrieveSessionsByRange(startInclusive, end)
      if (sessions) return sessions
    } catch (error) {
      console.error(error)
      throw new GittodoroError(
        'Error trying to retrieve sessions by range. ',
        error as Error
      )
    }
    throw new GittodoroError(
      'Error on `SessionFirebaseGateway.viewSessionsByRange(...)`. No sessions found.'
    )
  }

  readByIDs(ids: string[]): Promise<Session[]> {
    return retrieveSessionsByIDs(ids)
  }

  async deleteByRange(startInclusive: Date, end: Date): Promise<Session[]> {
    const sessions = await retrieveSessionsByRange(startInclusive, end)
    return this.deleteByIDs(sessions.map((s) => s.id))
  }

  async deleteByIDs(ids: string[]): Promise<Session[]> {
    const stringIDs = ids.map((id) => String(id))
    const sessionsToDelete = await retrieveSessionsByIDs(stringIDs)
    await deleteSessionsByIDs(stringIDs)

    const tryToGetTheDeletedSessions = await retrieveSessionsByIDs(stringIDs)
    if (tryToGetTheDeletedSessions.length > 0) {
      throw new GittodoroError('Error deleting the sessions.')
    }

    return sessionsToDelete
  }

  async first(): Promise<Session> {
    try {
      const session = await retrieveOldestSession()
      if (session) return session
    } catch (error) {
      throw new GittodoroError(
        'Error trying to get the first session. ',
        error as Error
      )
    }
    return Promise.reject(new GittodoroError('No sessions found.'))
  }
}
