import { SessionDataGatewayInterface } from '@emaric/gittodoro-ts/lib/interactor/data-gateways/SessionDataGatewayInterface'
import { Session } from '@emaric/gittodoro-ts/lib/interactor/entities/Session'

import {
  createUserSession,
  getUserData,
} from '@/modules/firebase/controllers/sessions'
import { Duration } from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'

const createID = (date: Date) => {
  return Number(
    [
      date.getFullYear(),
      date.getMonth(),
      date.getDay(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ].join('')
  )
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
    const response = await createUserSession(String(id), session)
    console.log('SessionFirebaseGateway.response: ', response)
    return session
  }
  readSession(start: Date): Promise<Session> {
    throw new Error('Method not implemented.')
  }
  endSession(end: Date): Promise<Session> {
    throw new Error('Method not implemented.')
  }
  viewSessionsByRange(start: Date, end: Date): Promise<Session[]> {
    throw new Error('Method not implemented.')
  }
  first(): Promise<Session> {
    throw new Error('Method not implemented.')
  }
  last(): Promise<Session> {
    throw new Error('Method not implemented.')
  }
}
