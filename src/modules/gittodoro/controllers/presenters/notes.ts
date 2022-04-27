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
  notesView: NotesViewInterface

  constructor(notesView: NotesViewInterface) {
    this.notesView = notesView
  }

  present(response: NoteBaseResponse): void {
    response.notes && this.notesView.updateView(mapNotes(response.notes))
  }
}
