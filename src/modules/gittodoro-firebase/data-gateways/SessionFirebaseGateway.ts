import DurationGatewayInterface from '@/modules/gittodoro/db/DurationGatewayInterface'
import SessionGatewayInterface from '@/modules/gittodoro/db/SessionGatewayInterface'
import GittodoroError from '@/modules/gittodoro/errors/GittodoroError'
import Session from '@emaric/gittodoro-ts/lib/interactor/entities/Session'
import {
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { sessionConverter } from '../controllers/converter'
import { UserCollections } from '../UserCollections'
import { createID } from '../utils'

export default class SessionFirebaseGateway implements SessionGatewayInterface {
  private readonly col: UserCollections
  private readonly durationGateway: DurationGatewayInterface

  constructor(col: UserCollections, durationGateway: DurationGatewayInterface) {
    this.col = col
    this.durationGateway = durationGateway
  }

  async startWithDurationID(start: Date, durationId: string) {
    try {
      const id = createID(start)
      const [duration] = await this.durationGateway.readByIDs([durationId])
      const session = new Session(id, duration, start)
      await this.col.session(id).set(sessionConverter.toFirestore(session))
      return session
    } catch (error) {
      throw new GittodoroError(
        'Error encountered while trying to start a Session with a Duration ID.\nInput:\n' +
          JSON.stringify({ start, durationId }),
        error as Error
      )
    }
  }

  async startWithDuration(
    start: Date,
    pomodoro: number,
    short: number,
    long: number,
    interval: number
  ) {
    try {
      const id = createID(start)
      let duration = await this.durationGateway.findMatch(
        pomodoro,
        short,
        long,
        interval
      )
      if (duration == undefined) {
        duration = await this.durationGateway.create(
          pomodoro,
          short,
          long,
          interval
        )
      }

      if (duration == undefined) {
        throw new Error('Failed tyring to save a new Duration.')
      }

      const session = new Session(id, duration, start)
      await this.col.session(id).set(sessionConverter.toFirestore(session))
      return session
    } catch (error) {
      throw new GittodoroError(
        'Error encountered while trying to start a Session with a Duration.\nInput:\n' +
          JSON.stringify({ start, pomodoro, short, long, interval }),
        error as Error
      )
    }
  }

  async stop(date: Date) {
    try {
      const response = await this.col.sessions
        .where('end', '==', null)
        .orderBy('start')
        .limit(1)
        .get()
      // let session = undefined
      // if (response.docs.length > 0) {
      //   session = response.docs[response.docs.length - 1].data()
      // }
      // return session
      throw new Error('testing...' + response)
      return undefined
    } catch (error) {
      throw new GittodoroError(
        'Error encountered while trying to stop a Session.\nInput:\n' +
          JSON.stringify({ date })
      )
    }
  }

  createWithDurationID(
    sessions: { durationId: string; start: Date; end?: Date | undefined }[]
  ): Promise<Session[]> {
    throw new Error('Method not implemented.')
  }

  createWithDuration(
    sessions: {
      pomodoro: number
      short: number
      long: number
      interval: number
      start: Date
      end?: Date | undefined
    }[]
  ): Promise<Session[]> {
    throw new Error('Method not implemented.')
  }

  readByRange(startInclusive: Date, end: Date): Promise<Session[]> {
    throw new Error('Method not implemented.')
  }

  readByIDs(ids: string[]): Promise<Session[]> {
    throw new Error('Method not implemented.')
  }

  first(): Promise<Session | undefined> {
    throw new Error('Method not implemented.')
  }

  deleteByRange(startInclusive: Date, end: Date): Promise<Session[]> {
    throw new Error('Method not implemented.')
  }

  deleteByIDs(ids: string[]): Promise<Session[]> {
    throw new Error('Method not implemented.')
  }
}
