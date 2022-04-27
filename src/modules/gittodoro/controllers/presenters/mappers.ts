import { SessionResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionResponse'
import { Session } from '@/modules/gittodoro/models/Session'
import { StateTimer as StateTimerResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/SessionResponse'
import { StateTimer } from '@/modules/gittodoro/models/StateTimer'
import { State } from '@/modules/gittodoro/models/State'

import { NoteResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/NoteResponse'
import { Note } from '@/modules/gittodoro/models/Note'

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
