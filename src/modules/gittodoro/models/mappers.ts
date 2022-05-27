import { SessionResponse } from '@emaric/gittodoro-ts/lib/interactor/external-users/session/io/response.model'
import { Session } from './Session'

export const mapSession = (sessionResponse: SessionResponse): Session => {
  const session = new Session({
    ...sessionResponse,
  })

  return session
}

export const mapSessions = (sessionResponses: SessionResponse[]): Session[] => {
  return sessionResponses.map((session) => mapSession(session))
}
