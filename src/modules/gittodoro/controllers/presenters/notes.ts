import { NotePresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/NotePresenterInterface'
import { NoteBaseResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/NoteResponse'

import { mapNote, mapNotes } from './mappers'

export class NotesPresenter implements NotePresenterInterface {
  private notesView?: CallableFunction

  constructor(notesView?: CallableFunction) {
    this.notesView = notesView
  }

  present(response: NoteBaseResponse) {
    const note = response.note && mapNote(response.note)
    const notes = response.notes && mapNotes(response.notes)

    const viewResponse = { note, notes }

    this.notesView && this.notesView(viewResponse)

    return Promise.resolve(viewResponse)
  }
}
