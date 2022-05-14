import { SessionResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionResponse'
import { Session } from '@/modules/gittodoro/models/Session'
import { StateTimer as StateTimerResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionResponse'
import { StateTimer } from '@/modules/gittodoro/models/StateTimer'
import { State } from '@/modules/gittodoro/models/State'

import { NoteResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/NoteResponse'
import { Note } from '@/modules/gittodoro/models/Note'
import { SessionModelRequest } from '@emaric/gittodoro-ts/lib/interactor/requests/SessionRequest'
import { Duration } from '@/models/Duration'

export const mapTimerSequence = (
  timerSequence: StateTimerResponse[]
): StateTimer[] => {
  return timerSequence.map((timer) => ({
    state: (<any>State)[timer.state],
    duration: timer.duration,
  }))
}

export const mapSession = (sessionResponse: SessionResponse): Session => {
  const session = new Session({
    ...sessionResponse,
    id: sessionResponse.id,
    timerSequence: mapTimerSequence(sessionResponse.timerSequence),
  })

  return session
}

export const mapSessions = (sessionResponses: SessionResponse[]): Session[] => {
  return sessionResponses.map((session) => mapSession(session))
}

export const mapNote = (noteResponse: NoteResponse): Note => {
  const note = new Note({
    ...noteResponse,
    id: noteResponse.id == undefined ? -1 : noteResponse.id,
    date: noteResponse.date ? noteResponse.date : new Date(),
    content: noteResponse.content ? noteResponse.content : '',
  })

  return note
}

export const mapNotes = (notes: NoteResponse[]): Note[] => {
  return notes.map((note) => mapNote(note))
}

export const mapTimerSequenceToDuration = (
  timerSequence: StateTimer[]
): Duration => {
  const duration: Duration = {
    pomodoro:
      timerSequence.find((timer) => timer.state == State.pomodoro)?.duration ||
      0,
    short:
      timerSequence.find((timer) => timer.state == State.short)?.duration || 0,
    long:
      timerSequence.find((timer) => timer.state == State.long)?.duration || 0,
    longInterval: timerSequence.length / 2,
  }
  return duration
}

export const mapSessionToRequest = (session: Session) => {
  const duration = mapTimerSequenceToDuration(session.timerSequence)
  const request: SessionModelRequest = {
    id: session.id,
    start: session.start,
    end: session.end,
    pomodoro: duration.pomodoro,
    short: duration.short,
    long: duration.long,
    longInterval: duration.longInterval,
  }

  return request
}

export const mapSessionsToRequests = (sessions: Session[]) => {
  return sessions.map((session) => mapSessionToRequest(session))
}
