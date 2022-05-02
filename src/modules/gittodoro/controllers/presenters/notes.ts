import { NotePresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/NotePresenterInterface'
import { NoteBaseResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/NoteResponse'

import { Note } from '@/modules/gittodoro/models/Note'
import { mapNote, mapNotes } from './mappers'

export interface NoteViewInterface {
  updateView(note: Note): void
}

export interface NotesViewInterface {
  updateView(notes: Note[]): void
}

export class NotePresenter implements NotePresenterInterface {
  noteView: NoteViewInterface

  constructor(noteView: NoteViewInterface) {
    this.noteView = noteView
  }

  present(response: NoteBaseResponse): void {
    response.note && this.noteView.updateView(mapNote(response.note))
  }
}

export class NotesPresenter implements NotePresenterInterface {
  private notesView?: CallableFunction

  constructor(notesView?: CallableFunction) {
    this.notesView = notesView
  }

  setCallback(cb: CallableFunction) {
    this.notesView = cb
  }

  present(response: NoteBaseResponse): void {
    const note = response.note && mapNote(response.note)
    const notes = response.notes && mapNotes(response.notes)

    this.notesView && this.notesView({ note, notes })
  }
}
