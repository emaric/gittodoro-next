import { NotePresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/NotePresenterInterface'
import { NoteBaseResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/NoteResponse'
import { Note } from '../../models/Note'

import { mapNote, mapNotes } from '../../models/mappers'

export type NotesViewType = {
  note?: Note
  notes?: Note[]
}

export interface NotesViewInterface {
  updateView: (value: NotesViewType) => void
}

export class NotesPresenter implements NotePresenterInterface {
  private view?: NotesViewInterface

  constructor(view?: NotesViewInterface) {
    this.view = view
  }

  present(response: NoteBaseResponse) {
    const note = response.note && mapNote(response.note)
    const notes = response.notes && mapNotes(response.notes)

    const viewResponse = { note, notes }

    this.view && this.view.updateView(viewResponse)
    return Promise.resolve(viewResponse)
  }
}
